import { ApiError, AuthError } from './errors';
import { getAccessToken } from './token';
import { attemptTokenRefresh } from './refresh';
import type { ApiErrorBody } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
  isRetry = false
): Promise<T> {
  const { body, headers: customHeaders, ...restOptions } = options;
  const headers = new Headers(customHeaders);

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...restOptions,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Only treat a 401 as an expired session if we actually sent a token.
  // Otherwise (e.g. a wrong password on login) fall through to ApiError.
  if (response.status === 401 && accessToken) {
    if (!isRetry && (await attemptTokenRefresh())) {
      return apiClient<T>(endpoint, options, true);
    }
    throw new AuthError('Session expired');
  }

  if (!response.ok) {
    const body: Partial<ApiErrorBody> = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      body.error?.message ?? 'Request failed',
      body.error?.code,
      body.error?.details
    );
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

import { setAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function attemptTokenRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      setAccessToken(accessToken);
      return true;
    }
  } catch {
    // Network error: treat as a failed refresh.
  }

  setAccessToken(null);
  return false;
}

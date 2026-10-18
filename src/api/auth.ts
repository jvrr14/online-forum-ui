import { apiClient } from './client';
import { setAccessToken } from './token';
import type { AuthResponse, LoginInput, RegisterInput } from '../types';

export const authApi = {
  register: async (input: RegisterInput) => {
    const { user, accessToken } = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: input,
    });
    setAccessToken(accessToken);
    return user;
  },

  login: async (input: LoginInput) => {
    const { user, accessToken } = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: input,
    });
    setAccessToken(accessToken);
    return user;
  },

  logout: async () => {
    await apiClient<void>('/auth/logout', { method: 'POST' });
    setAccessToken(null);
  },

  revokeAllSessions: () => apiClient<void>('/auth/sessions', { method: 'DELETE' }),
};

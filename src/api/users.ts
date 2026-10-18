import { apiClient } from './client';
import { buildQuery } from './query';
import type {
  CreateUserInput,
  PaginationParams,
  Post,
  Profile,
  PublicUser,
  UpdateOwnUserInput,
  UpdateUserInput,
  UpsertProfileInput,
  UserDetail,
  UserListItem,
  UserWithProfile,
} from '../types';

export const usersApi = {
  // Current user
  getMe: () => apiClient<UserWithProfile>('/users/me'),

  updateMe: (input: UpdateOwnUserInput) =>
    apiClient<PublicUser>('/users/me', { method: 'PUT', body: input }),

  upsertMyProfile: (input: UpsertProfileInput) =>
    apiClient<Profile>('/users/me/profile', { method: 'PUT', body: input }),

  // Public
  getPosts: (id: number, params?: PaginationParams) =>
    apiClient<Post[]>(`/users/${id}/posts${buildQuery(params)}`),

  // Admin only
  getAll: (params?: PaginationParams) =>
    apiClient<UserListItem[]>(`/users${buildQuery(params)}`),

  getById: (id: number) => apiClient<UserDetail>(`/users/${id}`),

  create: (input: CreateUserInput) =>
    apiClient<UserWithProfile>('/users', { method: 'POST', body: input }),

  update: (id: number, input: UpdateUserInput) =>
    apiClient<PublicUser>(`/users/${id}`, { method: 'PUT', body: input }),

  upsertProfile: (id: number, input: UpsertProfileInput) =>
    apiClient<Profile>(`/users/${id}/profile`, { method: 'PUT', body: input }),

  delete: (id: number) => apiClient<void>(`/users/${id}`, { method: 'DELETE' }),
};

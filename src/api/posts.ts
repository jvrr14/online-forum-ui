import { apiClient } from './client';
import { buildQuery } from './query';
import type {
  CreatePostInput,
  ListPostsParams,
  Post,
  PostList,
  PostWithAuthor,
  PostWithCategories,
  PostWithFullAuthor,
  TransferPostsResult,
  UpdatePostInput,
} from '../types';

export const postsApi = {
  getAll: (params?: ListPostsParams, options?: { signal?: AbortSignal }) =>
    apiClient<PostList>(`/posts${buildQuery(params)}`, { signal: options?.signal }),

  getById: (id: number) => apiClient<PostWithFullAuthor>(`/posts/${id}`),

  create: (input: CreatePostInput) =>
    apiClient<PostWithAuthor>('/posts', { method: 'POST', body: input }),

  update: (id: number, input: UpdatePostInput) =>
    apiClient<Post>(`/posts/${id}`, { method: 'PUT', body: input }),

  publish: (id: number) => apiClient<Post>(`/posts/${id}/publish`, { method: 'PATCH' }),

  incrementViews: (id: number) => apiClient<Post>(`/posts/${id}/view`, { method: 'PATCH' }),

  delete: (id: number) => apiClient<void>(`/posts/${id}`, { method: 'DELETE' }),

  addCategories: (id: number, categoryNames: string[]) =>
    apiClient<PostWithCategories>(`/posts/${id}/categories/add`, {
      method: 'PATCH',
      body: { categoryNames },
    }),

  removeCategory: (id: number, categoryName: string) =>
    apiClient<PostWithCategories>(`/posts/${id}/categories/remove`, {
      method: 'PATCH',
      body: { categoryName },
    }),

  // Admin only.
  transfer: (fromAuthorId: number, toAuthorId: number) =>
    apiClient<TransferPostsResult>('/posts/transfer', {
      method: 'POST',
      body: { fromAuthorId, toAuthorId },
    }),
};

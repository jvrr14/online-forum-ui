import { apiClient } from './client';

export const authorsApi = {
  publishAllPosts: (authorId: number) =>
    apiClient<{ message: string }>(`/authors/${authorId}/publish-all`, { method: 'POST' }),
};

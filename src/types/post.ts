import type { Category } from './category';

// Dates arrive as ISO strings because JSON has no Date type.
export interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  views: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostAuthor {
  id: number;
  username: string;
}

export interface PostWithAuthor extends Post {
  author: PostAuthor;
}

export interface PostWithFullAuthor extends Post {
  author: PostAuthor & { email: string };
}

export interface PostWithCategories extends Post {
  categories: Category[];
}

export interface PostList {
  data: PostWithAuthor[];
  meta: { total: number; page: number; totalPages: number };
}

export interface TransferPostsResult {
  transferred: number;
  from: string;
  to: string;
}

export interface ListPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  published?: boolean;
  category?: string;
}

export interface CreatePostInput {
  title: string;
  content?: string | null;
}

// At least one field is required by the backend.
export interface UpdatePostInput {
  title?: string;
  content?: string | null;
  published?: boolean;
}

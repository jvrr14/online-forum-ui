export type Role = 'USER' | 'ADMIN' | 'MODERATOR';

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    requestId: string;
    details?: unknown;
  };
}

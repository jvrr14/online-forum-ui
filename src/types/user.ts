import type { Role } from './api';
import type { PostWithCategories } from './post';

export interface PublicUser {
  id: number;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: number;
  bio: string;
  avatar: string | null;
  userId: number;
}

export interface UserWithProfile extends PublicUser {
  profile: Profile | null;
}

export interface UserListItem extends UserWithProfile {
  _count: { posts: number };
}

export interface UserDetail extends UserWithProfile {
  posts: PostWithCategories[];
}

export interface CreateUserInput {
  username: string;
  email: string;
  // The backend expects an already hashed password here, not plain text.
  passwordHash: string;
  role?: Role;
  bio?: string;
}

// At least one field is required by the backend.
export interface UpdateUserInput {
  username?: string;
  email?: string;
  role?: Role;
}

// At least one field is required by the backend.
export interface UpdateOwnUserInput {
  username?: string;
  email?: string;
}

// At least one field is required by the backend.
export interface UpsertProfileInput {
  bio?: string;
  avatar?: string | null;
}

import type { PublicUser } from './user';

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}

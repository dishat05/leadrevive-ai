import type { Request } from 'express';

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export type AuthenticatedRequest = Request & { user: AuthUser };

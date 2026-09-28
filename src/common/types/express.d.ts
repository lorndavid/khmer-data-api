import { SystemRole } from '../constants/roles.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: {
    id: string;
    name: SystemRole | string;
    permissions: string[];
  };
}

export interface AuthenticatedApiKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  rate_limit: number;
}

declare global {
  namespace Express {
    interface Request {
      id: string;
      user?: AuthenticatedUser;
      apiKey?: AuthenticatedApiKey;
      startTime?: number;
    }
  }
}

export {};

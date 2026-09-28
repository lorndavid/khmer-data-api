import { apiClient } from './client';
import type { ApiResponse } from '../types/api.types';
import type { User, AuthTokens } from '../types/user.types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponseData {
  user: User;
  tokens: AuthTokens;
}

export const authApi = {
  async register(data: RegisterPayload) {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    return res.data;
  },

  async login(data: LoginPayload) {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    return res.data;
  },

  async me() {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },

  async logout(refreshToken?: string) {
    const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/logout', {
      refresh_token: refreshToken,
    });
    return res.data;
  },
};

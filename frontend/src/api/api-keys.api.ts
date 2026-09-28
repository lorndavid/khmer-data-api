import { apiClient } from './client';
import type { ApiResponse } from '../types/api.types';
import type { ApiKey, CreateApiKeyResult } from '../types/user.types';

export const apiKeysApi = {
  async getApiKeys() {
    const res = await apiClient.get<ApiResponse<ApiKey[]>>('/api-keys');
    return res.data;
  },

  async createApiKey(name: string, expires_in_days?: number) {
    const res = await apiClient.post<ApiResponse<CreateApiKeyResult>>('/api-keys', {
      name,
      expires_in_days,
    });
    return res.data;
  },

  async revokeApiKey(id: string) {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/api-keys/${id}`);
    return res.data;
  },
};

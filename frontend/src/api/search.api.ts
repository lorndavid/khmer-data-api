import { apiClient } from './client';
import type { ApiResponse } from '../types/api.types';
import type { SearchResultItem } from '../types/location.types';

export const searchApi = {
  async search(query: string, limit: number = 10) {
    if (!query || query.trim().length === 0) {
      return { success: true, data: [] as SearchResultItem[], meta: {} };
    }
    const res = await apiClient.get<ApiResponse<SearchResultItem[]>>('/search', {
      params: { q: query.trim(), limit },
    });
    return res.data;
  },
};

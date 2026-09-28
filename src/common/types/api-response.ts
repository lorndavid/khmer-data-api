import { ErrorCode } from '../constants/error-codes.js';

export interface ResponseMeta {
  request_id: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface PaginationMeta extends ResponseMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  meta: ResponseMeta;
}

export interface ApiCollectionResponse<T = unknown> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
  [key: string]: unknown;
}

export interface ApiErrorPayload {
  code: ErrorCode | string;
  message: string;
  details?: ApiErrorDetail[] | Record<string, unknown> | null;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
  meta: ResponseMeta;
}

import { Response, Request } from 'express';
import { HttpStatus, HttpStatusCode } from '../constants/http-status.js';
import {
  ApiResponse,
  ApiCollectionResponse,
  ApiErrorResponse,
  ApiErrorPayload,
} from '../types/api-response.js';

export function getRequestId(req: Request): string {
  return (req.id || req.headers['x-request-id'] || 'anonymous-request') as string;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: HttpStatusCode = HttpStatus.OK,
  customMeta: Record<string, unknown> = {},
): Response<ApiResponse<T>> {
  const req = res.req;
  const requestId = getRequestId(req);

  const payload: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      request_id: requestId,
      timestamp: new Date().toISOString(),
      ...customMeta,
    },
  };

  res.setHeader('X-Request-ID', requestId);
  return res.status(statusCode).json(payload);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  customMeta: Record<string, unknown> = {},
): Response<ApiResponse<T>> {
  return sendSuccess(res, data, HttpStatus.CREATED, customMeta);
}

export function sendCollection<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number },
  customMeta: Record<string, unknown> = {},
): Response<ApiCollectionResponse<T>> {
  const req = res.req;
  const requestId = getRequestId(req);
  const totalPages =
    Math.ceil(pagination.total / pagination.limit) || (pagination.total === 0 ? 0 : 1);

  const payload: ApiCollectionResponse<T> = {
    success: true,
    data,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      total_pages: totalPages,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      ...customMeta,
    },
  };

  res.setHeader('X-Request-ID', requestId);
  return res.status(HttpStatus.OK).json(payload);
}

export function sendError(
  res: Response,
  error: ApiErrorPayload,
  statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
): Response<ApiErrorResponse> {
  const req = res.req;
  const requestId = getRequestId(req);

  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: error.details ?? null,
    },
    meta: {
      request_id: requestId,
      timestamp: new Date().toISOString(),
    },
  };

  res.setHeader('X-Request-ID', requestId);
  return res.status(statusCode).json(payload);
}

export function sendNoContent(res: Response): Response {
  const req = res.req;
  const requestId = getRequestId(req);
  res.setHeader('X-Request-ID', requestId);
  return res.status(HttpStatus.NO_CONTENT).send();
}

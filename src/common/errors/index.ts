import { AppError } from './app-error.js';
import { ErrorCodes, ErrorCode } from '../constants/error-codes.js';
import { HttpStatus } from '../constants/http-status.js';
import { ApiErrorDetail } from '../types/api-response.js';

export class BadRequestError extends AppError {
  constructor(
    message = 'Bad request',
    details: ApiErrorDetail[] | Record<string, unknown> | null = null,
  ) {
    super(message, HttpStatus.BAD_REQUEST, ErrorCodes.BAD_REQUEST, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details: ApiErrorDetail[] | null = null) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorCodes.VALIDATION_ERROR, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', code: ErrorCode | string = ErrorCodes.UNAUTHORIZED) {
    super(message, HttpStatus.UNAUTHORIZED, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message = 'Forbidden: Insufficient permissions',
    code: ErrorCode | string = ErrorCodes.FORBIDDEN,
  ) {
    super(message, HttpStatus.FORBIDDEN, code);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', code: ErrorCode | string = ErrorCodes.RESOURCE_NOT_FOUND) {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, code);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details: Record<string, unknown> | null = null) {
    super(message, HttpStatus.CONFLICT, ErrorCodes.CONFLICT, details);
  }
}

export class RateLimitError extends AppError {
  constructor(
    message = 'Too many requests, please slow down',
    details: Record<string, unknown> | null = null,
  ) {
    super(message, HttpStatus.TOO_MANY_REQUESTS, ErrorCodes.RATE_LIMIT_EXCEEDED, details);
  }
}

export * from './app-error.js';

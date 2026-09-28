import { ErrorCode, ErrorCodes } from '../constants/error-codes.js';
import { HttpStatus, HttpStatusCode } from '../constants/http-status.js';
import { ApiErrorDetail } from '../types/api-response.js';

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly code: ErrorCode | string;
  public readonly details: ApiErrorDetail[] | Record<string, unknown> | null;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    code: ErrorCode | string = ErrorCodes.INTERNAL_SERVER_ERROR,
    details: ApiErrorDetail[] | Record<string, unknown> | null = null,
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

import { Request, Response } from 'express';
import { ErrorCodes } from '../constants/error-codes.js';
import { HttpStatus } from '../constants/http-status.js';
import { sendError } from '../utils/response.js';

export function notFoundMiddleware(req: Request, res: Response): void {
  sendError(
    res,
    {
      code: ErrorCodes.RESOURCE_NOT_FOUND,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      details: null,
    },
    HttpStatus.NOT_FOUND,
  );
}

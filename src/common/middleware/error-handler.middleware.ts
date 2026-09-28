import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/app-error.js';
import { ErrorCodes } from '../constants/error-codes.js';
import { HttpStatus } from '../constants/http-status.js';
import { sendError } from '../utils/response.js';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';

export function errorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = (req.id || req.headers['x-request-id'] || 'unknown') as string;

  // 1. Handled AppError instances
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, requestId, path: req.path, method: req.method }, err.message);
    } else {
      logger.warn(
        { errCode: err.code, message: err.message, requestId, path: req.path },
        err.message,
      );
    }

    sendError(
      res,
      {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      err.statusCode,
    );
    return;
  }

  // 2. Zod Validation Error
  if (err instanceof ZodError) {
    const formattedDetails = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));

    logger.warn(
      { requestId, path: req.path, validationErrors: formattedDetails },
      'Request validation failed',
    );

    sendError(
      res,
      {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Invalid input parameters or request body',
        details: formattedDetails,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
    return;
  }

  // 3. Prisma Known Request Error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta?.target.join(', ') : 'field';
      sendError(
        res,
        {
          code: ErrorCodes.CONFLICT,
          message: `A resource with the same unique value for (${target}) already exists`,
          details: { target: err.meta?.target },
        },
        HttpStatus.CONFLICT,
      );
      return;
    }

    // Record not found
    if (err.code === 'P2025') {
      sendError(
        res,
        {
          code: ErrorCodes.RESOURCE_NOT_FOUND,
          message: 'Target resource not found in database',
          details: null,
        },
        HttpStatus.NOT_FOUND,
      );
      return;
    }

    // Foreign key constraint failure
    if (err.code === 'P2003') {
      sendError(
        res,
        {
          code: ErrorCodes.BAD_REQUEST,
          message: 'Foreign key constraint violation. Associated parent resource does not exist.',
          details: { field: err.meta?.field_name },
        },
        HttpStatus.BAD_REQUEST,
      );
      return;
    }
  }

  // 4. Invalid JSON Body Parse Error
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(
      res,
      {
        code: ErrorCodes.BAD_REQUEST,
        message: 'Malformed JSON payload in request body',
        details: null,
      },
      HttpStatus.BAD_REQUEST,
    );
    return;
  }

  // 5. Unhandled Internal Server Errors
  logger.error(
    {
      err: {
        message: err.message,
        stack: err.stack,
        name: err.name,
      },
      requestId,
      path: req.path,
      method: req.method,
    },
    'Unhandled server error occurred',
  );

  const isProd = env.NODE_ENV === 'production';
  sendError(
    res,
    {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: isProd ? 'An unexpected internal server error occurred' : err.message,
      details: isProd ? null : { stack: err.stack },
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}

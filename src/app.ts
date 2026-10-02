import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env.js';
import { requestIdMiddleware } from './common/middleware/request-id.middleware.js';
import { responseTimeMiddleware } from './common/middleware/response-time.middleware.js';
import { errorHandlerMiddleware } from './common/middleware/error-handler.middleware.js';
import { notFoundMiddleware } from './common/middleware/not-found.middleware.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { rootRouter } from './routes/index.js';
import { docsRouter } from './docs/swagger.js';

export function createApp(): Express {
  const app = express();

  // Security HTTP headers with Swagger UI exceptions
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          imgSrc: ["'self'", 'data:', 'https://validator.swagger.io'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // CORS Configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (
          env.NODE_ENV === 'development' ||
          env.CORS_ORIGINS.includes(origin) ||
          env.CORS_ORIGINS.includes('*')
        ) {
          return callback(null, true);
        }
        return callback(
          new Error(`CORS policy does not allow access from origin: ${origin}`),
          false,
        );
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Request-ID',
        'X-API-Key',
        'X-Refresh-Token',
      ],
      exposedHeaders: [
        'X-Request-ID',
        'X-Response-Time',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
        'Retry-After',
      ],
    }),
  );

  // Measure backend internal processing time
  app.use(responseTimeMiddleware());

  // Compression
  app.use(compression());

  // Request Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Attach Request ID
  app.use(requestIdMiddleware);

  // Swagger Documentation
  app.use('/docs', docsRouter);

  // Health and Readiness checks (unversioned for orchestration & monitoring)
  app.use('/', healthRoutes);

  // API Routes (/api/v1, /api/v2)
  app.use('/', rootRouter);

  // Catch unhandled 404 routes
  app.use(notFoundMiddleware);

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}

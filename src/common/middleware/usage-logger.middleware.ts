import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database.js';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';

export function usageLoggerMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const requestId = (req.id || req.headers['x-request-id'] || 'unknown') as string;
      const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const ipAddress = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(',')[0].trim();
      const userAgent = (req.headers['user-agent'] as string) || null;

      // Log request details via Pino
      logger.info(
        {
          requestId,
          method: req.method,
          url: req.originalUrl,
          statusCode,
          durationMs: duration,
          ip: ipAddress,
          userId: req.user?.id || null,
          apiKeyId: req.apiKey?.id || null,
        },
        `${req.method} ${req.originalUrl} ${statusCode} - ${duration}ms`,
      );

      // In test mode, skip background database insertion
      if (env.NODE_ENV === 'test') {
        return;
      }

      // If API key is present or it's an authenticated developer request, record in ApiUsageLog
      if (req.apiKey || (req.user && req.path.startsWith('/api/v1/'))) {
        prisma.apiUsageLog
          .create({
            data: {
              api_key_id: req.apiKey?.id || null,
              user_id: req.user?.id || null,
              endpoint: req.originalUrl.split('?')[0],
              method: req.method,
              status_code: statusCode,
              response_time_ms: duration,
              ip_address: ipAddress,
              user_agent: userAgent,
              request_id: requestId,
            },
          })
          .catch((err) => {
            logger.warn({ err }, 'Failed to persist API usage log');
          });
      }
    });

    next();
  };
}

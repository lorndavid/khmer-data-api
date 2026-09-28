import { Request, Response } from 'express';
import { checkDatabaseConnection } from '../../config/database.js';
import { checkRedisConnection } from '../../config/redis.js';
import { HttpStatus } from '../../common/constants/http-status.js';

export async function getHealth(req: Request, res: Response): Promise<void> {
  const [dbOk, redisOk] = await Promise.all([checkDatabaseConnection(), checkRedisConnection()]);

  const isHealthy = dbOk; // Primary dependency is PostgreSQL

  const responseData = {
    status: isHealthy ? 'ok' : 'degraded',
    service: 'khmerapi-backend',
    version: '1.0.0',
    database: dbOk ? 'connected' : 'disconnected',
    redis: redisOk ? 'connected' : 'disconnected_or_disabled',
    timestamp: new Date().toISOString(),
  };

  res.setHeader('X-Request-ID', req.id || 'health-check');
  res.status(isHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE).json(responseData);
}

export async function getReady(_req: Request, res: Response): Promise<void> {
  const dbOk = await checkDatabaseConnection();
  if (dbOk) {
    res.status(HttpStatus.OK).json({ status: 'ready' });
  } else {
    res
      .status(HttpStatus.SERVICE_UNAVAILABLE)
      .json({ status: 'not_ready', reason: 'Database unavailable' });
  }
}

export function getLive(_req: Request, res: Response): void {
  res.status(HttpStatus.OK).json({ status: 'live' });
}

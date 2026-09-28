import { Request, Response, NextFunction } from 'express';
import { redisCache } from '../../config/redis.js';
import { env } from '../../config/env.js';
import { RateLimitError } from '../errors/index.js';

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTimeSeconds: number;
}

// Memory fallback store when Redis is unavailable
const memoryRateLimitStore = new Map<string, { count: number; expiresAt: number }>();

export function rateLimiterMiddleware() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Determine client identity & tier
      let clientIdentifier: string;
      let limit: number;

      if (req.user) {
        // Admin or authenticated user
        const isSuperOrAdmin =
          req.user.role.name === 'super_admin' || req.user.role.name === 'admin';
        limit = isSuperOrAdmin ? env.RATE_LIMIT_ADMIN : env.RATE_LIMIT_DEVELOPER;
        clientIdentifier = `user:${req.user.id}`;
      } else if (req.apiKey) {
        // Developer API Key
        limit = req.apiKey.rate_limit || env.RATE_LIMIT_DEVELOPER;
        clientIdentifier = `apikey:${req.apiKey.id}`;
      } else {
        // Anonymous client by IP
        limit = env.RATE_LIMIT_ANONYMOUS;
        const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const clientIp = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(',')[0].trim();
        clientIdentifier = `ip:${clientIp}`;
      }

      const windowSeconds = env.RATE_LIMIT_WINDOW_SECONDS;
      const rateLimitInfo = await consumeRateLimit(clientIdentifier, limit, windowSeconds);

      // Set standard rate limit headers
      res.setHeader('X-RateLimit-Limit', rateLimitInfo.limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, rateLimitInfo.remaining));
      res.setHeader('X-RateLimit-Reset', rateLimitInfo.resetTimeSeconds);

      if (rateLimitInfo.remaining < 0) {
        const retryAfter = Math.max(
          1,
          rateLimitInfo.resetTimeSeconds - Math.floor(Date.now() / 1000),
        );
        res.setHeader('Retry-After', retryAfter);

        throw new RateLimitError(
          'Rate limit exceeded. Please retry after ' + retryAfter + ' seconds.',
          {
            limit: rateLimitInfo.limit,
            remaining: 0,
            reset_at: new Date(rateLimitInfo.resetTimeSeconds * 1000).toISOString(),
          },
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

async function consumeRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitInfo> {
  const nowMs = Date.now();
  const currentWindowIndex = Math.floor(nowMs / (windowSeconds * 1000));
  const windowEndMs = (currentWindowIndex + 1) * windowSeconds * 1000;
  const resetTimeSeconds = Math.floor(windowEndMs / 1000);
  const cacheKey = `ratelimit:${identifier}:${currentWindowIndex}`;

  const redisClient = redisCache.getClient();

  if (redisClient && (await redisCache.checkConnection())) {
    try {
      const pipeline = redisClient.multi();
      pipeline.incr(cacheKey);
      pipeline.expire(cacheKey, windowSeconds + 5);
      const results = await pipeline.exec();

      const currentCount = results && results[0] && results[0][1] ? Number(results[0][1]) : 1;
      const remaining = limit - currentCount;

      return {
        limit,
        remaining,
        resetTimeSeconds,
      };
    } catch {
      // Fallback to memory if Redis multi command fails
    }
  }

  // In-memory fallback
  let record = memoryRateLimitStore.get(cacheKey);
  if (!record || record.expiresAt < nowMs) {
    record = { count: 1, expiresAt: windowEndMs };
    memoryRateLimitStore.set(cacheKey, record);
  } else {
    record.count += 1;
  }

  // Periodic cleanup of stale memory keys
  if (memoryRateLimitStore.size > 10000) {
    for (const [k, v] of memoryRateLimitStore.entries()) {
      if (v.expiresAt < nowMs) {
        memoryRateLimitStore.delete(k);
      }
    }
  }

  return {
    limit,
    remaining: limit - record.count,
    resetTimeSeconds,
  };
}

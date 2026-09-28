import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

class RedisCacheManager {
  private client: Redis | null = null;
  private isConnected = false;
  private memoryFallback = new Map<string, { value: string; expiresAt?: number }>();

  constructor() {
    if (env.REDIS_ENABLED) {
      this.initClient();
    } else {
      logger.warn('Redis is disabled by configuration. In-memory cache fallback active.');
    }
  }

  private initClient(): void {
    try {
      this.client = new Redis(env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 2,
        retryStrategy(times) {
          if (times > 5) {
            logger.warn('Redis connection retry limit reached. Continuing with fallback.');
            return null;
          }
          return Math.min(times * 200, 2000);
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('Connected to Redis successfully');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        logger.warn({ err: err.message }, 'Redis error encountered, using fallback cache');
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });

      // Attempt initial connect asynchronously
      this.client.connect().catch((err) => {
        logger.warn({ err: err.message }, 'Initial Redis connection failed, fallback ready');
      });
    } catch (err) {
      logger.warn({ err }, 'Failed to initialize Redis client');
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isConnected && this.client) {
        const data = await this.client.get(key);
        return data ? (JSON.parse(data) as T) : null;
      }
    } catch (err) {
      logger.warn({ key, err }, 'Failed to get key from Redis, checking memory fallback');
    }

    // Memory fallback
    const entry = this.memoryFallback.get(key);
    if (entry) {
      if (entry.expiresAt && entry.expiresAt < Date.now()) {
        this.memoryFallback.delete(key);
        return null;
      }
      return JSON.parse(entry.value) as T;
    }
    return null;
  }

  public async set(key: string, value: unknown, ttlSeconds = env.REDIS_TTL_SECONDS): Promise<void> {
    const serialized = JSON.stringify(value);
    try {
      if (this.isConnected && this.client) {
        if (ttlSeconds > 0) {
          await this.client.set(key, serialized, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, serialized);
        }
        return;
      }
    } catch (err) {
      logger.warn({ key, err }, 'Failed to set key in Redis, writing to memory fallback');
    }

    // Memory fallback
    this.memoryFallback.set(key, {
      value: serialized,
      expiresAt: ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  public async del(key: string): Promise<void> {
    try {
      if (this.isConnected && this.client) {
        await this.client.del(key);
      }
    } catch (err) {
      logger.warn({ key, err }, 'Failed to delete key from Redis');
    }
    this.memoryFallback.delete(key);
  }

  public async delByPattern(pattern: string): Promise<void> {
    try {
      if (this.isConnected && this.client) {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      }
    } catch (err) {
      logger.warn({ pattern, err }, 'Failed to delete keys by pattern in Redis');
    }

    // Memory fallback pattern deletion
    const regexPattern = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    for (const key of this.memoryFallback.keys()) {
      if (regexPattern.test(key)) {
        this.memoryFallback.delete(key);
      }
    }
  }

  public async flushAll(): Promise<void> {
    try {
      if (this.isConnected && this.client) {
        await this.client.flushall();
      }
    } catch (err) {
      logger.warn({ err }, 'Failed to flushall in Redis');
    }
    this.memoryFallback.clear();
  }

  public async checkConnection(): Promise<boolean> {
    if (!this.client || !env.REDIS_ENABLED) {
      return false;
    }
    try {
      const pingResult = await this.client.ping();
      return pingResult === 'PONG';
    } catch {
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
        logger.info('Redis client disconnected cleanly');
      } catch (err) {
        logger.error({ err }, 'Error quitting Redis client');
      }
    }
  }

  public getClient(): Redis | null {
    return this.client;
  }
}

export const redisCache = new RedisCacheManager();
export const checkRedisConnection = () => redisCache.checkConnection();
export const disconnectRedis = () => redisCache.disconnect();

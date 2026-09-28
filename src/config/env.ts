import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  API_BASE_URL: z.string().default('http://localhost:4000'),

  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgrespassword@localhost:5432/khmerapi?schema=public'),

  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_ENABLED: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  REDIS_TTL_SECONDS: z.coerce.number().default(3600),

  JWT_SECRET: z.string().min(16).default('super_secret_jwt_key_khmerapi_platform_default'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(16)
    .default('super_secret_refresh_jwt_key_khmerapi_platform_default'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  RATE_LIMIT_ANONYMOUS: z.coerce.number().default(60),
  RATE_LIMIT_DEVELOPER: z.coerce.number().default(300),
  RATE_LIMIT_ADMIN: z.coerce.number().default(1000),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().default(60),

  CORS_ORIGINS: z
    .string()
    .default(
      'http://localhost:3000,http://localhost:4000,https://khmerapi.dev,https://admin.khmerapi.dev',
    )
    .transform((val) => val.split(',').map((origin) => origin.trim())),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;

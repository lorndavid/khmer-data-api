import { beforeAll, afterAll } from 'vitest';
import { createApp } from '../src/app.js';
import { Express } from 'express';

let app: Express;

export function getTestApp(): Express {
  if (!app) {
    app = createApp();
  }
  return app;
}

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.REDIS_ENABLED = 'false'; // Use in-memory cache fallback for unit test isolation
});

afterAll(async () => {
  // Cleanup test resources
});

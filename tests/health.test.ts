import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { getTestApp } from './setup.js';
import * as dbModule from '../src/config/database.js';

describe('Health & Liveness Endpoints', () => {
  const app = getTestApp();

  it('GET /live should return 200 with live status', async () => {
    const res = await request(app).get('/live');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'live' });
  });

  it('GET /ready should return 200 when database is connected', async () => {
    vi.spyOn(dbModule, 'checkDatabaseConnection').mockResolvedValue(true);

    const res = await request(app).get('/ready');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ready' });
  });

  it('GET /health should return standard service metadata', async () => {
    vi.spyOn(dbModule, 'checkDatabaseConnection').mockResolvedValue(true);

    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('service', 'khmerapi-backend');
    expect(res.body).toHaveProperty('version', '1.0.0');
    expect(res.body).toHaveProperty('database');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.headers).toHaveProperty('x-request-id');
  });
});

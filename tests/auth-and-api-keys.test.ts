import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { getTestApp } from './setup.js';
import { prisma } from '../src/config/database.js';
import { hashPassword, hashSha256 } from '../src/common/utils/crypto.js';
import { signAccessToken } from '../src/common/utils/jwt.js';

describe('Authentication & API Keys', () => {
  const app = getTestApp();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /api/v1/auth/register should create new user and return tokens', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    vi.spyOn(prisma.role, 'findUnique').mockResolvedValue({
      id: 'r-1',
      name: 'viewer',
      is_system: true,
      description: null,
      created_at: new Date(),
      updated_at: new Date(),
    });
    vi.spyOn(prisma.user, 'create').mockResolvedValue({
      id: 'u-1',
      email: 'sokha@example.com',
      password_hash: 'hash',
      first_name: 'Sokha',
      last_name: 'Chan',
      role_id: 'r-1',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      role: { id: 'r-1', name: 'viewer' },
    } as never);
    vi.spyOn(prisma.refreshToken, 'create').mockResolvedValue({} as never);

    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'sokha@example.com',
      password: 'StrongPassword123',
      first_name: 'Sokha',
      last_name: 'Chan',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens).toHaveProperty('accessToken');
    expect(res.body.data.tokens).toHaveProperty('refreshToken');
    expect(res.body.data.user.email).toBe('sokha@example.com');
  });

  it('POST /api/v1/auth/login should authenticate valid credentials', async () => {
    const passwordHash = await hashPassword('StrongPassword123');

    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'u-1',
      email: 'sokha@example.com',
      password_hash: passwordHash,
      first_name: 'Sokha',
      last_name: 'Chan',
      role_id: 'r-1',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      role: { id: 'r-1', name: 'viewer' },
    } as never);
    vi.spyOn(prisma.refreshToken, 'create').mockResolvedValue({} as never);

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'sokha@example.com',
      password: 'StrongPassword123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens).toHaveProperty('accessToken');
  });

  it('POST /api/v1/auth/login with invalid password should return 401', async () => {
    const passwordHash = await hashPassword('CorrectPassword123');

    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'u-1',
      email: 'sokha@example.com',
      password_hash: passwordHash,
      is_active: true,
      role: { id: 'r-1', name: 'viewer' },
    } as never);

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'sokha@example.com',
      password: 'WrongPassword123',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/api-keys should generate an API key for authenticated user', async () => {
    const token = signAccessToken({
      userId: 'u-1',
      email: 'sokha@example.com',
      roleId: 'r-1',
      roleName: 'viewer',
    });

    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'u-1',
      email: 'sokha@example.com',
      first_name: 'Sokha',
      last_name: 'Chan',
      is_active: true,
      role: {
        id: 'r-1',
        name: 'viewer',
        permissions: [],
      },
    } as never);

    vi.spyOn(prisma.apiKey, 'create').mockResolvedValue({
      id: 'key-1',
      name: 'Mobile App Key',
      key_prefix: 'kh_live_123456',
      rate_limit: 300,
      last_used_at: null,
      expires_at: null,
      is_active: true,
      created_at: new Date(),
    } as never);

    const res = await request(app)
      .post('/api/v1/api-keys')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Mobile App Key' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('rawKey');
    expect(res.body.data.rawKey.startsWith('kh_live_')).toBe(true);
    expect(res.body.data.apiKey.key_prefix.startsWith('kh_live_')).toBe(true);
  });

  it('Authenticated request with X-API-Key should be recognized', async () => {
    const rawKey = 'kh_live_testdemo1234567890abcdef1234567890';
    const keyHash = hashSha256(rawKey);

    vi.spyOn(prisma.apiKey, 'findUnique').mockResolvedValue({
      id: 'key-1',
      user_id: 'u-1',
      name: 'Test Key',
      key_prefix: 'kh_live_testde',
      key_hash: keyHash,
      rate_limit: 300,
      expires_at: null,
      is_active: true,
    } as never);
    vi.spyOn(prisma.apiKey, 'update').mockResolvedValue({} as never);
    vi.spyOn(prisma.province, 'count').mockResolvedValue(0);
    vi.spyOn(prisma.province, 'findMany').mockResolvedValue([] as never);

    const res = await request(app).get('/api/v1/provinces').set('X-API-Key', rawKey);

    expect(res.status).toBe(200);
  });
});

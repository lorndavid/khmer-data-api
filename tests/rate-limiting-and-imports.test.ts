import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { getTestApp } from './setup.js';
import { prisma } from '../src/config/database.js';
import { signAccessToken } from '../src/common/utils/jwt.js';

describe('Rate Limiting & Data Import Engine', () => {
  const app = getTestApp();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const superAdminToken = signAccessToken({
    userId: 'admin-1',
    email: 'admin@khmerapi.dev',
    roleId: 'role-super-admin',
    roleName: 'super_admin',
  });

  it('All API responses should include X-RateLimit headers', async () => {
    vi.spyOn(prisma.province, 'count').mockResolvedValue(0);
    vi.spyOn(prisma.province, 'findMany').mockResolvedValue([] as never);

    const res = await request(app).get('/api/v1/provinces');

    expect(res.status).toBe(200);
    expect(res.headers).toHaveProperty('x-ratelimit-limit');
    expect(res.headers).toHaveProperty('x-ratelimit-remaining');
    expect(res.headers).toHaveProperty('x-ratelimit-reset');
  });

  it('POST /api/v1/admin/data-imports with invalid relationships should abort transaction and roll back', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'admin-1',
      email: 'admin@khmerapi.dev',
      is_active: true,
      role: {
        id: 'role-super-admin',
        name: 'super_admin',
        permissions: [],
      },
    } as never);

    vi.spyOn(prisma.dataImport, 'create').mockResolvedValue({
      id: 'imp-1',
      file_name: 'test.json',
      file_type: 'json',
      resource_type: 'districts',
      status: 'PROCESSING',
      total_records: 1,
      success_records: 0,
      failed_records: 0,
      error_log: null,
      imported_by: 'admin@khmerapi.dev',
      created_at: new Date(),
      updated_at: new Date(),
    } as never);

    vi.spyOn(prisma.dataImport, 'update').mockResolvedValue({
      id: 'imp-1',
      status: 'FAILED',
    } as never);

    // Mock transaction that fails on missing parent province
    vi.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
      const mockTx = {
        province: {
          findFirst: vi.fn().mockResolvedValue(null), // Nonexistent province!
        },
      };
      return callback(mockTx as never);
    });

    const res = await request(app)
      .post('/api/v1/admin/data-imports')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        resource_type: 'districts',
        data: [
          {
            code: '9999',
            province_code: 'NON_EXISTENT_PROVINCE',
            name_km: 'ស្រុកសាកល្បង',
            name_en: 'Test District',
          },
        ],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('Data import failed and rolled back');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { getTestApp } from './setup.js';
import { prisma } from '../src/config/database.js';
import { signAccessToken } from '../src/common/utils/jwt.js';

describe('Admin APIs, RBAC, Import & Export', () => {
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

  const viewerToken = signAccessToken({
    userId: 'viewer-1',
    email: 'viewer@example.com',
    roleId: 'role-viewer',
    roleName: 'viewer',
  });

  it('GET /api/v1/admin/users without auth should return 401', async () => {
    const res = await request(app).get('/api/v1/admin/users');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/admin/users with viewer token should return 403', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'viewer-1',
      email: 'viewer@example.com',
      first_name: 'Viewer',
      last_name: 'User',
      is_active: true,
      role: {
        id: 'role-viewer',
        name: 'viewer',
        permissions: [],
      },
    } as never);

    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${viewerToken}`);

    expect(res.status).toBe(403);
  });

  it('POST /api/v1/admin/provinces with super_admin should succeed and create province', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'admin-1',
      email: 'admin@khmerapi.dev',
      first_name: 'Admin',
      last_name: 'User',
      is_active: true,
      role: {
        id: 'role-super-admin',
        name: 'super_admin',
        permissions: [],
      },
    } as never);

    vi.spyOn(prisma.province, 'create').mockResolvedValue({
      id: 'prov-new',
      code: '26',
      name_km: 'ខេត្តថ្មី',
      name_en: 'New Province',
      slug: 'new-province',
      type: 'Province',
      latitude: null,
      longitude: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    } as never);

    vi.spyOn(prisma.auditLog, 'create').mockResolvedValue({} as never);

    const res = await request(app)
      .post('/api/v1/admin/provinces')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        code: '26',
        name_km: 'ខេត្តថ្មី',
        name_en: 'New Province',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe('26');
  });

  it('GET /api/v1/admin/system should return server and database status', async () => {
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

    const res = await request(app)
      .get('/api/v1/admin/system')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('node_version');
    expect(res.body.data).toHaveProperty('memory_usage');
    expect(res.body.data).toHaveProperty('database');
  });

  it('GET /api/v1/admin/export/provinces?format=json should export JSON format', async () => {
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

    vi.spyOn(prisma.province, 'findMany').mockResolvedValue([
      {
        code: '12',
        name_km: 'រាជធានីភ្នំពេញ',
        name_en: 'Phnom Penh',
        slug: 'phnom-penh',
        type: 'Municipality',
        latitude: 11.5564,
        longitude: 104.9282,
        is_active: true,
      },
    ] as never);

    const res = await request(app)
      .get('/api/v1/admin/export/provinces?format=json')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].code).toBe('12');
  });

  it('GET /api/v1/admin/export/provinces?format=csv should export CSV format', async () => {
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

    vi.spyOn(prisma.province, 'findMany').mockResolvedValue([
      {
        code: '12',
        name_km: 'រាជធានីភ្នំពេញ',
        name_en: 'Phnom Penh',
        slug: 'phnom-penh',
        type: 'Municipality',
        latitude: 11.5564,
        longitude: 104.9282,
        is_active: true,
      },
    ] as never);

    const res = await request(app)
      .get('/api/v1/admin/export/provinces?format=csv')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text).toContain('Phnom Penh');
  });
});

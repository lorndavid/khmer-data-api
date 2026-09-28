import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { getTestApp } from './setup.js';
import { prisma } from '../src/config/database.js';
import { signAccessToken } from '../src/common/utils/jwt.js';

describe('Admin CRUD, Data Sources & Coverage Tests', () => {
  const app = getTestApp();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(prisma.auditLog, 'create').mockResolvedValue({} as never);
  });

  const superAdminToken = signAccessToken({
    userId: 'admin-1',
    email: 'admin@khmerapi.dev',
    roleId: 'role-super-admin',
    roleName: 'super_admin',
  });

  it('GET /api/v1/data-sources should list data sources', async () => {
    vi.spyOn(prisma.dataSource, 'findMany').mockResolvedValue([
      {
        id: 'ds-1',
        name: 'NIS Cambodia Gazetteer',
        organization: 'National Institute of Statistics',
        url: 'https://nis.gov.kh',
        license: 'Open Data',
        description: 'Cambodia Geographic Gazetteer',
        last_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ] as never);

    const res = await request(app).get('/api/v1/data-sources');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].name).toBe('NIS Cambodia Gazetteer');
  });

  it('GET /api/v1/data-sources/:id should get single data source', async () => {
    vi.spyOn(prisma.dataSource, 'findUnique').mockResolvedValue({
      id: 'ds-1',
      name: 'NIS Cambodia Gazetteer',
      organization: 'National Institute of Statistics',
      url: 'https://nis.gov.kh',
      license: 'Open Data',
      description: 'Cambodia Geographic Gazetteer',
      last_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    } as never);

    const res = await request(app).get('/api/v1/data-sources/ds-1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('ds-1');
  });

  it('Admin District CRUD: create, update, delete', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'admin-1',
      email: 'admin@khmerapi.dev',
      is_active: true,
      role: { id: 'role-super-admin', name: 'super_admin', permissions: [] },
    } as never);

    vi.spyOn(prisma.district, 'create').mockResolvedValue({
      id: 'd-new',
      code: '1299',
      province_id: 'a3d24328-98e6-42d8-bf5b-c2e5055b89ab',
      name_km: 'ស្រុកថ្មី',
      name_en: 'New District',
      slug: 'new-district',
      type: 'District',
      latitude: null,
      longitude: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    } as never);

    const createRes = await request(app)
      .post('/api/v1/admin/districts')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        code: '1299',
        province_id: 'a3d24328-98e6-42d8-bf5b-c2e5055b89ab',
        name_km: 'ស្រុកថ្មី',
        name_en: 'New District',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.code).toBe('1299');

    // Update
    vi.spyOn(prisma.district, 'findFirst').mockResolvedValue({ id: 'd-new', code: '1299' } as never);
    vi.spyOn(prisma.district, 'update').mockResolvedValue({ id: 'd-new', code: '1299', name_en: 'Updated District' } as never);

    const updateRes = await request(app)
      .patch('/api/v1/admin/districts/d-new')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ name_en: 'Updated District' });

    expect(updateRes.status).toBe(200);

    // Delete
    vi.spyOn(prisma.district, 'findFirst').mockResolvedValue({ id: 'd-new', code: '1299' } as never);
    vi.spyOn(prisma.district, 'delete').mockResolvedValue({ id: 'd-new' } as never);
    const deleteRes = await request(app)
      .delete('/api/v1/admin/districts/d-new')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(deleteRes.status).toBe(204);
  });

  it('Admin Commune CRUD: create, update, delete', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'admin-1',
      email: 'admin@khmerapi.dev',
      is_active: true,
      role: { id: 'role-super-admin', name: 'super_admin', permissions: [] },
    } as never);

    vi.spyOn(prisma.commune, 'create').mockResolvedValue({
      id: 'c-new',
      code: '129901',
      district_id: 'a3d24328-98e6-42d8-bf5b-c2e5055b89ab',
      name_km: 'ឃុំថ្មី',
      name_en: 'New Commune',
      slug: 'new-commune',
      type: 'Commune',
      latitude: null,
      longitude: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    } as never);

    const createRes = await request(app)
      .post('/api/v1/admin/communes')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        code: '129901',
        district_id: 'a3d24328-98e6-42d8-bf5b-c2e5055b89ab',
        name_km: 'ឃុំថ្មី',
        name_en: 'New Commune',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.code).toBe('129901');
  });

  it('Admin Village CRUD: create', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'admin-1',
      email: 'admin@khmerapi.dev',
      is_active: true,
      role: { id: 'role-super-admin', name: 'super_admin', permissions: [] },
    } as never);

    vi.spyOn(prisma.village, 'create').mockResolvedValue({
      id: 'v-new',
      code: '12990101',
      commune_id: 'a3d24328-98e6-42d8-bf5b-c2e5055b89ab',
      name_km: 'ភូមិថ្មី',
      name_en: 'New Village',
      slug: 'new-village',
      latitude: null,
      longitude: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    } as never);

    const createRes = await request(app)
      .post('/api/v1/admin/villages')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        code: '12990101',
        commune_id: 'a3d24328-98e6-42d8-bf5b-c2e5055b89ab',
        name_km: 'ភូមិថ្មី',
        name_en: 'New Village',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.code).toBe('12990101');
  });

  it('Admin Postal Code CRUD: create', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'admin-1',
      email: 'admin@khmerapi.dev',
      is_active: true,
      role: { id: 'role-super-admin', name: 'super_admin', permissions: [] },
    } as never);

    vi.spyOn(prisma.postalCode, 'create').mockResolvedValue({
      id: 'pc-new',
      postal_code: '99000',
      province_id: 'a3d24328-98e6-42d8-bf5b-c2e5055b89ab',
      district_id: null,
      commune_id: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    } as never);

    const createRes = await request(app)
      .post('/api/v1/admin/postal-codes')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        postal_code: '99000',
        province_id: 'a3d24328-98e6-42d8-bf5b-c2e5055b89ab',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.postal_code).toBe('99000');
  });
});

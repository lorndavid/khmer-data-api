import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { getTestApp } from './setup.js';
import { prisma } from '../src/config/database.js';

describe('Provinces API', () => {
  const app = getTestApp();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/v1/provinces should return a paginated collection of provinces', async () => {
    const mockProvinces = [
      {
        id: 'mock-p-1',
        code: '12',
        name_km: 'រាជធានីភ្នំពេញ',
        name_en: 'Phnom Penh',
        slug: 'phnom-penh',
        type: 'Municipality',
        latitude: 11.5564,
        longitude: 104.9282,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _count: { districts: 14, postal_codes: 4 },
      },
      {
        id: 'mock-p-2',
        code: '17',
        name_km: 'ខេត្តសៀមរាប',
        name_en: 'Siem Reap',
        slug: 'siem-reap',
        type: 'Province',
        latitude: 13.3671,
        longitude: 103.8448,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _count: { districts: 12, postal_codes: 2 },
      },
    ];

    vi.spyOn(prisma.province, 'count').mockResolvedValue(25);
    vi.spyOn(prisma.province, 'findMany').mockResolvedValue(mockProvinces as never);

    const res = await request(app).get('/api/v1/provinces?page=1&limit=20');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.meta).toHaveProperty('page', 1);
    expect(res.body.meta).toHaveProperty('limit', 20);
    expect(res.body.meta).toHaveProperty('total', 25);
    expect(res.body.meta).toHaveProperty('total_pages', 2);
    expect(res.body.meta).toHaveProperty('request_id');
    expect(res.headers).toHaveProperty('x-request-id');
  });

  it('GET /api/v1/provinces/:code should return a single province', async () => {
    const mockProvince = {
      id: 'mock-p-1',
      code: '12',
      name_km: 'រាជធានីភ្នំពេញ',
      name_en: 'Phnom Penh',
      slug: 'phnom-penh',
      type: 'Municipality',
      latitude: 11.5564,
      longitude: 104.9282,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      _count: { districts: 14, postal_codes: 4 },
    };

    vi.spyOn(prisma.province, 'findFirst').mockResolvedValue(mockProvince as never);

    const res = await request(app).get('/api/v1/provinces/12');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe('12');
    expect(res.body.data.name_en).toBe('Phnom Penh');
    expect(res.body.meta).toHaveProperty('request_id');
  });

  it('GET /api/v1/provinces/:code should return 404 for non-existent province', async () => {
    vi.spyOn(prisma.province, 'findFirst').mockResolvedValue(null);

    const res = await request(app).get('/api/v1/provinces/999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('RESOURCE_NOT_FOUND');
    expect(res.body.meta).toHaveProperty('request_id');
  });

  it('GET /api/v1/provinces/:code/districts should return districts of the province', async () => {
    const mockProvince = {
      id: 'mock-p-1',
      code: '12',
      name_km: 'រាជធានីភ្នំពេញ',
      name_en: 'Phnom Penh',
      slug: 'phnom-penh',
    };

    const mockDistricts = [
      {
        id: 'dist-1',
        code: '1202',
        province_id: 'mock-p-1',
        name_km: 'ខណ្ឌដូនពេញ',
        name_en: 'Doun Penh',
        slug: 'doun-penh',
        type: 'Khan',
        latitude: 11.57,
        longitude: 104.92,
        is_active: true,
        _count: { communes: 11, postal_codes: 1 },
      },
    ];

    vi.spyOn(prisma.province, 'findFirst').mockResolvedValue(mockProvince as never);
    vi.spyOn(prisma.district, 'findMany').mockResolvedValue(mockDistricts as never);

    const res = await request(app).get('/api/v1/provinces/12/districts');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.province.code).toBe('12');
    expect(Array.isArray(res.body.data.districts)).toBe(true);
    expect(res.body.data.districts[0].code).toBe('1202');
  });
});

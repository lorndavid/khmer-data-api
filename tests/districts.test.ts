import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { getTestApp } from './setup.js';
import { prisma } from '../src/config/database.js';

describe('Districts, Communes, Villages, & Postal Codes APIs', () => {
  const app = getTestApp();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/v1/districts should return paginated districts', async () => {
    vi.spyOn(prisma.district, 'count').mockResolvedValue(1);
    vi.spyOn(prisma.district, 'findMany').mockResolvedValue([
      {
        id: 'dist-1',
        code: '1202',
        province_id: 'prov-1',
        name_km: 'ខណ្ឌដូនពេញ',
        name_en: 'Doun Penh',
        slug: 'doun-penh',
        type: 'Khan',
        latitude: 11.572,
        longitude: 104.922,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        province: {
          id: 'prov-1',
          code: '12',
          name_km: 'ភ្នំពេញ',
          name_en: 'Phnom Penh',
          slug: 'phnom-penh',
        },
        _count: { communes: 11, postal_codes: 1 },
      },
    ] as never);

    const res = await request(app).get('/api/v1/districts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].code).toBe('1202');
  });

  it('GET /api/v1/communes should return communes list', async () => {
    vi.spyOn(prisma.commune, 'count').mockResolvedValue(1);
    vi.spyOn(prisma.commune, 'findMany').mockResolvedValue([
      {
        id: 'com-1',
        code: '120201',
        district_id: 'dist-1',
        name_km: 'សង្កាត់ផ្សារចាស់',
        name_en: 'Phsar Chas',
        slug: 'phsar-chas',
        type: 'Sangkat',
        latitude: 11.5714,
        longitude: 104.925,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        district: {
          id: 'dist-1',
          code: '1202',
          name_km: 'ដូនពេញ',
          name_en: 'Doun Penh',
          slug: 'doun-penh',
          province: {
            id: 'p-1',
            code: '12',
            name_km: 'ភ្នំពេញ',
            name_en: 'Phnom Penh',
            slug: 'phnom-penh',
          },
        },
        _count: { villages: 3, postal_codes: 1 },
      },
    ] as never);

    const res = await request(app).get('/api/v1/communes');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].code).toBe('120201');
  });

  it('GET /api/v1/villages should return villages list', async () => {
    vi.spyOn(prisma.village, 'count').mockResolvedValue(1);
    vi.spyOn(prisma.village, 'findMany').mockResolvedValue([
      {
        id: 'vil-1',
        code: '12020101',
        commune_id: 'com-1',
        name_km: 'ភូមិ១',
        name_en: 'Phum 1',
        slug: 'phum-1',
        latitude: 11.5714,
        longitude: 104.925,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        commune: {
          id: 'com-1',
          code: '120201',
          name_km: 'ផ្សារចាស់',
          name_en: 'Phsar Chas',
          slug: 'phsar-chas',
          district: {
            id: 'dist-1',
            code: '1202',
            name_km: 'ដូនពេញ',
            name_en: 'Doun Penh',
            slug: 'doun-penh',
            province: {
              id: 'p-1',
              code: '12',
              name_km: 'ភ្នំពេញ',
              name_en: 'Phnom Penh',
              slug: 'phnom-penh',
            },
          },
        },
      },
    ] as never);

    const res = await request(app).get('/api/v1/villages');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].code).toBe('12020101');
  });

  it('GET /api/v1/postal-codes should return postal codes list', async () => {
    vi.spyOn(prisma.postalCode, 'count').mockResolvedValue(1);
    vi.spyOn(prisma.postalCode, 'findMany').mockResolvedValue([
      {
        id: 'pc-1',
        postal_code: '12000',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        province: {
          id: 'p-1',
          code: '12',
          name_km: 'ភ្នំពេញ',
          name_en: 'Phnom Penh',
          slug: 'phnom-penh',
        },
        district: null,
        commune: null,
      },
    ] as never);

    const res = await request(app).get('/api/v1/postal-codes');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].postal_code).toBe('12000');
  });

  it('GET /api/v1/postal-codes/:postalCode should return details', async () => {
    vi.spyOn(prisma.postalCode, 'findMany').mockResolvedValue([
      {
        id: 'pc-1',
        postal_code: '12000',
        is_active: true,
        province: {
          id: 'p-1',
          code: '12',
          name_km: 'ភ្នំពេញ',
          name_en: 'Phnom Penh',
          slug: 'phnom-penh',
        },
        district: null,
        commune: null,
      },
    ] as never);

    const res = await request(app).get('/api/v1/postal-codes/12000');
    expect(res.status).toBe(200);
    expect(res.body.data.postal_code).toBe('12000');
    expect(res.body.data.count).toBe(1);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { getTestApp } from './setup.js';
import { prisma } from '../src/config/database.js';

describe('Locations, Search, Geo & Statistics APIs', () => {
  const app = getTestApp();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/v1/locations/:code should resolve province hierarchy', async () => {
    vi.spyOn(prisma.province, 'findFirst').mockResolvedValue({
      id: 'p-12',
      code: '12',
      name_km: 'រាជធានីភ្នំពេញ',
      name_en: 'Phnom Penh',
      slug: 'phnom-penh',
      postal_codes: [{ postal_code: '12000' }],
      districts: [
        {
          id: 'd-1',
          code: '1202',
          name_km: 'ដូនពេញ',
          name_en: 'Doun Penh',
          slug: 'doun-penh',
          type: 'Khan',
        },
      ],
    } as never);

    const res = await request(app).get('/api/v1/locations/12');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.level).toBe('province');
    expect(res.body.data.province.code).toBe('12');
  });

  it('GET /api/v1/search?q=Phnom%20Penh should return ranked search results', async () => {
    vi.spyOn(prisma.province, 'findMany').mockResolvedValue([
      {
        id: 'p-12',
        code: '12',
        name_km: 'រាជធានីភ្នំពេញ',
        name_en: 'Phnom Penh',
        slug: 'phnom-penh',
      },
    ] as never);
    vi.spyOn(prisma.district, 'findMany').mockResolvedValue([] as never);
    vi.spyOn(prisma.commune, 'findMany').mockResolvedValue([] as never);
    vi.spyOn(prisma.village, 'findMany').mockResolvedValue([] as never);
    vi.spyOn(prisma.postalCode, 'findMany').mockResolvedValue([] as never);

    const res = await request(app).get('/api/v1/search?q=Phnom%20Penh');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].type).toBe('province');
    expect(res.body.data[0].name_en).toBe('Phnom Penh');
    expect(res.body.data[0].score).toBeGreaterThan(50);
  });

  it('GET /api/v1/search without q should fail with validation error', async () => {
    const res = await request(app).get('/api/v1/search');
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/v1/geo/provinces should return GeoJSON format', async () => {
    vi.spyOn(prisma.province, 'findMany').mockResolvedValue([
      {
        id: 'p-12',
        code: '12',
        name_km: 'រាជធានីភ្នំពេញ',
        name_en: 'Phnom Penh',
        slug: 'phnom-penh',
        type: 'Municipality',
        latitude: 11.5564,
        longitude: 104.9282,
      },
    ] as never);

    const res = await request(app).get('/api/v1/geo/provinces');
    expect(res.status).toBe(200);
    expect(res.body.data.type).toBe('FeatureCollection');
    expect(res.body.data.features[0].geometry.coordinates).toEqual([104.9282, 11.5564]);
  });

  it('GET /api/v1/statistics should calculate actual counts from database', async () => {
    vi.spyOn(prisma.province, 'count').mockResolvedValue(25);
    vi.spyOn(prisma.district, 'count').mockResolvedValue(204);
    vi.spyOn(prisma.commune, 'count').mockResolvedValue(1652);
    vi.spyOn(prisma.village, 'count').mockResolvedValue(14500);
    vi.spyOn(prisma.postalCode, 'count').mockResolvedValue(1600);
    vi.spyOn(prisma.province, 'findFirst').mockResolvedValue({
      updated_at: new Date('2026-09-28T00:00:00.000Z'),
    } as never);

    const res = await request(app).get('/api/v1/statistics');
    expect(res.status).toBe(200);
    expect(res.body.data.province_count).toBe(25);
    expect(res.body.data.district_count).toBe(204);
    expect(res.body.data.commune_count).toBe(1652);
    expect(res.body.data.village_count).toBe(14500);
    expect(res.body.data.postal_code_count).toBe(1600);
  });
});

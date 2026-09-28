import { prisma } from '../../config/database.js';
import { redisCache } from '../../config/redis.js';

export class GeoService {
  async getGeoProvinces() {
    const cacheKey = 'geo:provinces';
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const provinces = await prisma.province.findMany({
      where: {
        is_active: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        code: true,
        name_km: true,
        name_en: true,
        slug: true,
        type: true,
        latitude: true,
        longitude: true,
      },
      orderBy: { code: 'asc' },
    });

    const geoData = {
      type: 'FeatureCollection',
      features: provinces.map((p) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.longitude, p.latitude],
        },
        properties: {
          id: p.id,
          code: p.code,
          name_km: p.name_km,
          name_en: p.name_en,
          slug: p.slug,
          type: p.type,
          latitude: p.latitude,
          longitude: p.longitude,
        },
      })),
      data: provinces,
    };

    await redisCache.set(cacheKey, geoData, 3600);
    return geoData;
  }

  async getGeoDistricts(provinceCode?: string) {
    const cacheKey = `geo:districts:${provinceCode || 'all'}`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const where: {
      is_active: boolean;
      latitude: { not: null };
      longitude: { not: null };
      province?: { code: string };
    } = {
      is_active: true,
      latitude: { not: null },
      longitude: { not: null },
    };

    if (provinceCode) {
      where.province = { code: provinceCode };
    }

    const districts = await prisma.district.findMany({
      where,
      select: {
        id: true,
        code: true,
        province_id: true,
        name_km: true,
        name_en: true,
        slug: true,
        type: true,
        latitude: true,
        longitude: true,
        province: {
          select: { code: true, name_km: true, name_en: true },
        },
      },
      orderBy: { code: 'asc' },
    });

    const geoData = {
      type: 'FeatureCollection',
      features: districts.map((d) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [d.longitude, d.latitude],
        },
        properties: {
          id: d.id,
          code: d.code,
          province_code: d.province.code,
          province_name_en: d.province.name_en,
          province_name_km: d.province.name_km,
          name_km: d.name_km,
          name_en: d.name_en,
          slug: d.slug,
          type: d.type,
          latitude: d.latitude,
          longitude: d.longitude,
        },
      })),
      data: districts,
    };

    await redisCache.set(cacheKey, geoData, 3600);
    return geoData;
  }

  async getGeoCommunes(districtCode?: string) {
    const cacheKey = `geo:communes:${districtCode || 'all'}`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const where: {
      is_active: boolean;
      latitude: { not: null };
      longitude: { not: null };
      district?: { code: string };
    } = {
      is_active: true,
      latitude: { not: null },
      longitude: { not: null },
    };

    if (districtCode) {
      where.district = { code: districtCode };
    }

    const communes = await prisma.commune.findMany({
      where,
      select: {
        id: true,
        code: true,
        name_km: true,
        name_en: true,
        slug: true,
        type: true,
        latitude: true,
        longitude: true,
        district: {
          select: {
            code: true,
            name_km: true,
            name_en: true,
            province: {
              select: { code: true, name_km: true, name_en: true },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
      take: 500, // Safe query limit for geo communes
    });

    const geoData = {
      type: 'FeatureCollection',
      features: communes.map((c) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [c.longitude, c.latitude],
        },
        properties: {
          id: c.id,
          code: c.code,
          district_code: c.district.code,
          district_name_en: c.district.name_en,
          province_code: c.district.province.code,
          province_name_en: c.district.province.name_en,
          name_km: c.name_km,
          name_en: c.name_en,
          slug: c.slug,
          type: c.type,
          latitude: c.latitude,
          longitude: c.longitude,
        },
      })),
      data: communes,
    };

    await redisCache.set(cacheKey, geoData, 3600);
    return geoData;
  }

  async getGeoVillages(communeCode?: string) {
    const cacheKey = `geo:villages:${communeCode || 'all'}`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const where: {
      is_active: boolean;
      latitude: { not: null };
      longitude: { not: null };
      commune?: { code: string };
    } = {
      is_active: true,
      latitude: { not: null },
      longitude: { not: null },
    };

    if (communeCode) {
      where.commune = { code: communeCode };
    }

    const villages = await prisma.village.findMany({
      where,
      select: {
        id: true,
        code: true,
        name_km: true,
        name_en: true,
        slug: true,
        latitude: true,
        longitude: true,
        commune: {
          select: {
            code: true,
            name_km: true,
            name_en: true,
          },
        },
      },
      orderBy: { code: 'asc' },
      take: 1000,
    });

    const geoData = {
      type: 'FeatureCollection',
      features: villages.map((v) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [v.longitude, v.latitude],
        },
        properties: {
          id: v.id,
          code: v.code,
          commune_code: v.commune.code,
          commune_name_en: v.commune.name_en,
          name_km: v.name_km,
          name_en: v.name_en,
          slug: v.slug,
          latitude: v.latitude,
          longitude: v.longitude,
        },
      })),
      data: villages,
    };

    await redisCache.set(cacheKey, geoData, 3600);
    return geoData;
  }
}

export const geoService = new GeoService();

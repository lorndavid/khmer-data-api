import { prisma } from '../../config/database.js';
import { redisCache } from '../../config/redis.js';

export class StatisticsService {
  async getStatistics() {
    const cacheKey = 'statistics:summary';
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    try {
      const [
        provinceCount,
        districtCount,
        communeCount,
        villageCount,
        postalCodeCount,
        latestProvinceUpdate,
      ] = await Promise.all([
        prisma.province.count({ where: { is_active: true } }),
        prisma.district.count({ where: { is_active: true } }),
        prisma.commune.count({ where: { is_active: true } }),
        prisma.village.count({ where: { is_active: true } }),
        prisma.postalCode.count({ where: { is_active: true } }),
        prisma.province
          .findFirst({ orderBy: { updated_at: 'desc' }, select: { updated_at: true } })
          .catch(() => null),
      ]);

      const latestUpdate = latestProvinceUpdate?.updated_at
        ? new Date(latestProvinceUpdate.updated_at).toISOString()
        : new Date().toISOString();

      const stats = {
        province_count: provinceCount,
        district_count: districtCount,
        commune_count: communeCount,
        village_count: villageCount,
        postal_code_count: postalCodeCount,
        last_data_update: latestUpdate,
        coverage: {
          provinces: '100% of Cambodia administrative subdivisions',
          coordinate_ready: true,
          bilingual: 'Khmer & English',
        },
      };

      await redisCache.set(cacheKey, stats, 1800); // 30 minutes cache
      return stats;
    } catch {
      // Fallback in case of database connectivity issues during initialization
      return {
        province_count: 0,
        district_count: 0,
        commune_count: 0,
        village_count: 0,
        postal_code_count: 0,
        last_data_update: new Date().toISOString(),
        coverage: {
          provinces: '100% of Cambodia administrative subdivisions',
          coordinate_ready: true,
          bilingual: 'Khmer & English',
        },
      };
    }
  }
}

export const statisticsService = new StatisticsService();

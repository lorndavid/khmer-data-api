import { prisma } from '../../config/database.js';
import { redisCache } from '../../config/redis.js';
import { NotFoundError } from '../../common/errors/index.js';

export interface LocationHierarchyResult {
  level: 'province' | 'district' | 'commune' | 'village';
  province: unknown;
  district: unknown;
  commune: unknown;
  village: unknown;
  postal_codes: unknown[];
}

export class LocationsService {
  async getLocationHierarchyByCode(code: string): Promise<LocationHierarchyResult> {
    const cleanCode = code.trim();
    const cacheKey = `locations:${cleanCode}`;
    const cached = await redisCache.get<LocationHierarchyResult>(cacheKey);
    if (cached) return cached;

    // Determine level from code length:
    // 2 chars -> Province
    // 4 chars -> District
    // 6 chars -> Commune
    // 8 chars -> Village
    const codeLen = cleanCode.length;

    let province: unknown = null;
    let district: unknown = null;
    let commune: unknown = null;
    let village: unknown = null;
    let postalCodes: unknown[] = [];

    if (codeLen === 2) {
      // Province level
      const prov = await prisma.province.findFirst({
        where: { code: cleanCode },
        include: {
          postal_codes: true,
          districts: {
            where: { is_active: true },
            select: { id: true, code: true, name_km: true, name_en: true, slug: true, type: true },
          },
        },
      });

      if (!prov) throw new NotFoundError(`Location with code ${cleanCode}`);
      province = prov;
      postalCodes = prov.postal_codes;
    } else if (codeLen === 4) {
      // District level
      const dist = await prisma.district.findFirst({
        where: { code: cleanCode },
        include: {
          province: true,
          postal_codes: true,
          communes: {
            where: { is_active: true },
            select: { id: true, code: true, name_km: true, name_en: true, slug: true, type: true },
          },
        },
      });

      if (!dist) throw new NotFoundError(`Location with code ${cleanCode}`);
      province = dist.province;
      district = dist;
      postalCodes = dist.postal_codes;
    } else if (codeLen === 6) {
      // Commune level
      const comm = await prisma.commune.findFirst({
        where: { code: cleanCode },
        include: {
          district: {
            include: { province: true },
          },
          postal_codes: true,
          villages: {
            where: { is_active: true },
            select: { id: true, code: true, name_km: true, name_en: true, slug: true },
          },
        },
      });

      if (!comm) throw new NotFoundError(`Location with code ${cleanCode}`);
      province = comm.district.province;
      district = comm.district;
      commune = comm;
      postalCodes = comm.postal_codes;
    } else if (codeLen >= 8) {
      // Village level
      const vill = await prisma.village.findFirst({
        where: { code: cleanCode },
        include: {
          commune: {
            include: {
              postal_codes: true,
              district: {
                include: {
                  postal_codes: true,
                  province: {
                    include: { postal_codes: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!vill) throw new NotFoundError(`Location with code ${cleanCode}`);
      province = vill.commune.district.province;
      district = vill.commune.district;
      commune = vill.commune;
      village = vill;
      postalCodes = [...vill.commune.postal_codes, ...vill.commune.district.postal_codes];
    } else {
      // Fallback: try searching across all levels
      const prov = await prisma.province.findFirst({ where: { code: cleanCode } });
      if (prov) {
        return this.getLocationHierarchyByCode(prov.code);
      }
      throw new NotFoundError(`Location with code ${cleanCode}`);
    }

    const result: LocationHierarchyResult = {
      level:
        codeLen === 2
          ? 'province'
          : codeLen === 4
            ? 'district'
            : codeLen === 6
              ? 'commune'
              : 'village',
      province,
      district,
      commune,
      village,
      postal_codes: postalCodes,
    };

    await redisCache.set(cacheKey, result, 3600);
    return result;
  }
}

export const locationsService = new LocationsService();

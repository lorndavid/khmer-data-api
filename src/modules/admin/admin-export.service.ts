import { stringify } from 'csv-stringify/sync';
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../common/errors/index.js';

export class ExportService {
  async exportResource(
    resource: 'provinces' | 'districts' | 'communes' | 'villages' | 'postal-codes',
    format: 'json' | 'csv' = 'json',
  ): Promise<{ data: string | object; contentType: string; filename: string }> {
    let rawRecords: Record<string, unknown>[] = [];
    const timestamp = new Date().toISOString().split('T')[0];

    switch (resource) {
      case 'provinces': {
        const provinces = await prisma.province.findMany({
          orderBy: { code: 'asc' },
          select: {
            code: true,
            name_km: true,
            name_en: true,
            slug: true,
            type: true,
            latitude: true,
            longitude: true,
            is_active: true,
          },
        });
        rawRecords = provinces as unknown as Record<string, unknown>[];
        break;
      }
      case 'districts': {
        const districts = await prisma.district.findMany({
          orderBy: { code: 'asc' },
          select: {
            code: true,
            province: { select: { code: true, name_en: true } },
            name_km: true,
            name_en: true,
            slug: true,
            type: true,
            latitude: true,
            longitude: true,
            is_active: true,
          },
        });
        rawRecords = districts.map((d) => ({
          code: d.code,
          province_code: d.province.code,
          province_name_en: d.province.name_en,
          name_km: d.name_km,
          name_en: d.name_en,
          slug: d.slug,
          type: d.type,
          latitude: d.latitude,
          longitude: d.longitude,
          is_active: d.is_active,
        }));
        break;
      }
      case 'communes': {
        const communes = await prisma.commune.findMany({
          orderBy: { code: 'asc' },
          select: {
            code: true,
            district: {
              select: {
                code: true,
                name_en: true,
                province: { select: { code: true, name_en: true } },
              },
            },
            name_km: true,
            name_en: true,
            slug: true,
            type: true,
            latitude: true,
            longitude: true,
            is_active: true,
          },
        });
        rawRecords = communes.map((c) => ({
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
          is_active: c.is_active,
        }));
        break;
      }
      case 'villages': {
        const villages = await prisma.village.findMany({
          orderBy: { code: 'asc' },
          select: {
            code: true,
            commune: { select: { code: true, name_en: true } },
            name_km: true,
            name_en: true,
            slug: true,
            latitude: true,
            longitude: true,
            is_active: true,
          },
        });
        rawRecords = villages.map((v) => ({
          code: v.code,
          commune_code: v.commune.code,
          commune_name_en: v.commune.name_en,
          name_km: v.name_km,
          name_en: v.name_en,
          slug: v.slug,
          latitude: v.latitude,
          longitude: v.longitude,
          is_active: v.is_active,
        }));
        break;
      }
      case 'postal-codes': {
        const postalCodes = await prisma.postalCode.findMany({
          orderBy: { postal_code: 'asc' },
          select: {
            postal_code: true,
            province: { select: { code: true, name_en: true } },
            district: { select: { code: true, name_en: true } },
            commune: { select: { code: true, name_en: true } },
            is_active: true,
          },
        });
        rawRecords = postalCodes.map((pc) => ({
          postal_code: pc.postal_code,
          province_code: pc.province.code,
          province_name_en: pc.province.name_en,
          district_code: pc.district?.code || '',
          district_name_en: pc.district?.name_en || '',
          commune_code: pc.commune?.code || '',
          commune_name_en: pc.commune?.name_en || '',
          is_active: pc.is_active,
        }));
        break;
      }
      default:
        throw new BadRequestError(`Unsupported export resource: ${resource}`);
    }

    if (format === 'csv') {
      const csvContent = stringify(rawRecords, { header: true });
      return {
        data: csvContent,
        contentType: 'text/csv',
        filename: `khmerapi_${resource}_${timestamp}.csv`,
      };
    }

    return {
      data: rawRecords,
      contentType: 'application/json',
      filename: `khmerapi_${resource}_${timestamp}.json`,
    };
  }
}

export const exportService = new ExportService();

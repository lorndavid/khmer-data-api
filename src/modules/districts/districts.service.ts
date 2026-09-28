import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { redisCache } from '../../config/redis.js';
import { parsePagination } from '../../common/utils/pagination.js';
import { slugify } from '../../common/utils/slugify.js';
import { NotFoundError } from '../../common/errors/index.js';
import {
  ListDistrictsQuery,
  CreateDistrictInput,
  UpdateDistrictInput,
} from './districts.schema.js';

export class DistrictsService {
  async listDistricts(query: ListDistrictsQuery) {
    const { page, limit, skip, take, sort, order } = parsePagination(
      {
        page: query.page,
        limit: query.limit,
        sort: query.sort,
        order: query.order as 'asc' | 'desc',
      },
      'code',
      'asc',
    );

    const cacheKey = `districts:list:${page}:${limit}:${query.province_code || ''}:${query.province_id || ''}:${query.search || ''}:${query.type || ''}:${sort}:${order}:${query.active}`;
    const cached = await redisCache.get<{
      data: unknown[];
      pagination: { page: number; limit: number; total: number };
    }>(cacheKey);
    if (cached) return cached;

    const where: Prisma.DistrictWhereInput = {};

    if (query.active !== undefined) {
      where.is_active = query.active;
    }

    if (query.type) {
      where.type = { equals: query.type, mode: 'insensitive' };
    }

    if (query.province_id) {
      where.province_id = query.province_id;
    }

    if (query.province_code) {
      where.province = { code: query.province_code };
    }

    if (query.search && query.search.trim()) {
      const searchTerm = query.search.trim();
      where.OR = [
        { code: { contains: searchTerm, mode: 'insensitive' } },
        { name_km: { contains: searchTerm, mode: 'insensitive' } },
        { name_en: { contains: searchTerm, mode: 'insensitive' } },
        { slug: { contains: searchTerm.toLowerCase(), mode: 'insensitive' } },
      ];
    }

    const [total, districts] = await Promise.all([
      prisma.district.count({ where }),
      prisma.district.findMany({
        where,
        skip,
        take,
        orderBy: { [sort]: order },
        select: {
          id: true,
          code: true,
          province_id: true,
          province: {
            select: {
              id: true,
              code: true,
              name_km: true,
              name_en: true,
              slug: true,
            },
          },
          name_km: true,
          name_en: true,
          slug: true,
          type: true,
          latitude: true,
          longitude: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          _count: {
            select: {
              communes: true,
              postal_codes: true,
            },
          },
        },
      }),
    ]);

    const result = {
      data: districts,
      pagination: {
        page,
        limit,
        total,
      },
    };

    await redisCache.set(cacheKey, result, 3600);
    return result;
  }

  async getDistrictByCode(codeOrSlug: string) {
    const cacheKey = `district:${codeOrSlug}`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const district = await prisma.district.findFirst({
      where: {
        OR: [{ code: codeOrSlug }, { slug: codeOrSlug.toLowerCase() }, { id: codeOrSlug }],
      },
      include: {
        province: {
          select: {
            id: true,
            code: true,
            name_km: true,
            name_en: true,
            slug: true,
            type: true,
          },
        },
        _count: {
          select: {
            communes: true,
            postal_codes: true,
          },
        },
      },
    });

    if (!district) {
      throw new NotFoundError('District');
    }

    await redisCache.set(cacheKey, district, 3600);
    return district;
  }

  async getDistrictCommunes(codeOrSlug: string) {
    const cacheKey = `district:${codeOrSlug}:communes`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const district = await prisma.district.findFirst({
      where: {
        OR: [{ code: codeOrSlug }, { slug: codeOrSlug.toLowerCase() }, { id: codeOrSlug }],
      },
      include: {
        province: {
          select: {
            id: true,
            code: true,
            name_km: true,
            name_en: true,
          },
        },
      },
    });

    if (!district) {
      throw new NotFoundError('District');
    }

    const communes = await prisma.commune.findMany({
      where: { district_id: district.id, is_active: true },
      orderBy: { code: 'asc' },
      select: {
        id: true,
        code: true,
        district_id: true,
        name_km: true,
        name_en: true,
        slug: true,
        type: true,
        latitude: true,
        longitude: true,
        is_active: true,
        _count: {
          select: {
            villages: true,
            postal_codes: true,
          },
        },
      },
    });

    const result = {
      district: {
        id: district.id,
        code: district.code,
        name_km: district.name_km,
        name_en: district.name_en,
        slug: district.slug,
        province: district.province,
      },
      communes,
    };

    await redisCache.set(cacheKey, result, 3600);
    return result;
  }

  // Admin Mutations
  async createDistrict(data: CreateDistrictInput) {
    const slug = data.slug || slugify(data.name_en);

    const district = await prisma.district.create({
      data: {
        code: data.code,
        province_id: data.province_id,
        name_km: data.name_km,
        name_en: data.name_en,
        slug,
        type: data.type || 'District',
        latitude: data.latitude,
        longitude: data.longitude,
        is_active: data.is_active ?? true,
      },
    });

    await this.invalidateCache(district.code);
    return district;
  }

  async updateDistrict(idOrCode: string, data: UpdateDistrictInput) {
    const existing = await prisma.district.findFirst({
      where: { OR: [{ id: idOrCode }, { code: idOrCode }] },
    });

    if (!existing) {
      throw new NotFoundError('District');
    }

    const slug = data.slug || (data.name_en ? slugify(data.name_en) : undefined);

    const updated = await prisma.district.update({
      where: { id: existing.id },
      data: {
        ...data,
        slug: slug !== undefined ? slug : existing.slug,
      },
    });

    await this.invalidateCache(existing.code);
    return updated;
  }

  async deleteDistrict(idOrCode: string) {
    const existing = await prisma.district.findFirst({
      where: { OR: [{ id: idOrCode }, { code: idOrCode }] },
    });

    if (!existing) {
      throw new NotFoundError('District');
    }

    await prisma.district.delete({
      where: { id: existing.id },
    });

    await this.invalidateCache(existing.code);
  }

  async invalidateCache(code?: string) {
    await redisCache.delByPattern('districts:*');
    await redisCache.delByPattern('provinces:*');
    await redisCache.delByPattern('locations:*');
    await redisCache.delByPattern('statistics:*');
    if (code) {
      await redisCache.del(`district:${code}`);
      await redisCache.del(`district:${code}:communes`);
    }
  }
}

export const districtsService = new DistrictsService();

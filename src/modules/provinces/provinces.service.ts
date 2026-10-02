import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { redisCache } from '../../config/redis.js';
import { parsePagination } from '../../common/utils/pagination.js';
import { slugify } from '../../common/utils/slugify.js';
import { NotFoundError } from '../../common/errors/index.js';
import {
  ListProvincesQuery,
  CreateProvinceInput,
  UpdateProvinceInput,
} from './provinces.schema.js';

export class ProvincesService {
  async listProvinces(query: ListProvincesQuery) {
    const { page, limit, skip, take, sort, order } = parsePagination(
      {
        page: query.page,
        limit: query.limit ?? 25,
        sort: query.sort,
        order: query.order as 'asc' | 'desc',
      },
      'code',
      'asc',
    );

    const cacheKey = `provinces:list:${page}:${limit}:${query.search || ''}:${sort}:${order}:${query.active}`;
    const cached = await redisCache.get<{
      data: unknown[];
      pagination: { page: number; limit: number; total: number };
    }>(cacheKey);
    if (cached) {
      return cached;
    }

    const where: Prisma.ProvinceWhereInput = {};

    if (query.active !== undefined) {
      where.is_active = query.active;
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

    const [total, provinces] = await Promise.all([
      prisma.province.count({ where }),
      prisma.province.findMany({
        where,
        skip,
        take,
        orderBy: { [sort]: order },
        select: {
          id: true,
          code: true,
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
              districts: true,
              postal_codes: true,
            },
          },
        },
      }),
    ]);

    const result = {
      data: provinces,
      pagination: {
        page,
        limit,
        total,
      },
    };

    await redisCache.set(cacheKey, result, 3600);
    return result;
  }

  async getProvinceByCode(codeOrSlug: string) {
    const cacheKey = `province:${codeOrSlug}`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const province = await prisma.province.findFirst({
      where: {
        OR: [{ code: codeOrSlug }, { slug: codeOrSlug.toLowerCase() }, { id: codeOrSlug }],
      },
      include: {
        _count: {
          select: {
            districts: true,
            postal_codes: true,
          },
        },
      },
    });

    if (!province) {
      throw new NotFoundError('Province');
    }

    await redisCache.set(cacheKey, province, 3600);
    return province;
  }

  async getProvinceDistricts(codeOrSlug: string) {
    const cacheKey = `province:${codeOrSlug}:districts`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const province = await prisma.province.findFirst({
      where: {
        OR: [{ code: codeOrSlug }, { slug: codeOrSlug.toLowerCase() }, { id: codeOrSlug }],
      },
    });

    if (!province) {
      throw new NotFoundError('Province');
    }

    const districts = await prisma.district.findMany({
      where: { province_id: province.id, is_active: true },
      orderBy: { code: 'asc' },
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
        is_active: true,
        _count: {
          select: {
            communes: true,
            postal_codes: true,
          },
        },
      },
    });

    const result = {
      province: {
        id: province.id,
        code: province.code,
        name_km: province.name_km,
        name_en: province.name_en,
        slug: province.slug,
      },
      districts,
    };

    await redisCache.set(cacheKey, result, 3600);
    return result;
  }

  // Admin Mutations
  async createProvince(data: CreateProvinceInput) {
    const slug = data.slug || slugify(data.name_en);

    const province = await prisma.province.create({
      data: {
        code: data.code,
        name_km: data.name_km,
        name_en: data.name_en,
        slug,
        type: data.type || 'Province',
        country_id: data.country_id,
        latitude: data.latitude,
        longitude: data.longitude,
        is_active: data.is_active ?? true,
      },
    });

    await this.invalidateCache(province.code);
    return province;
  }

  async updateProvince(idOrCode: string, data: UpdateProvinceInput) {
    const existing = await prisma.province.findFirst({
      where: { OR: [{ id: idOrCode }, { code: idOrCode }] },
    });

    if (!existing) {
      throw new NotFoundError('Province');
    }

    const slug = data.slug || (data.name_en ? slugify(data.name_en) : undefined);

    const updated = await prisma.province.update({
      where: { id: existing.id },
      data: {
        ...data,
        slug: slug !== undefined ? slug : existing.slug,
      },
    });

    await this.invalidateCache(existing.code);
    return updated;
  }

  async deleteProvince(idOrCode: string) {
    const existing = await prisma.province.findFirst({
      where: { OR: [{ id: idOrCode }, { code: idOrCode }] },
    });

    if (!existing) {
      throw new NotFoundError('Province');
    }

    await prisma.province.delete({
      where: { id: existing.id },
    });

    await this.invalidateCache(existing.code);
  }

  async invalidateCache(code?: string) {
    await redisCache.delByPattern('provinces:*');
    await redisCache.delByPattern('locations:*');
    await redisCache.delByPattern('statistics:*');
    if (code) {
      await redisCache.del(`province:${code}`);
      await redisCache.del(`province:${code}:districts`);
    }
  }
}

export const provincesService = new ProvincesService();

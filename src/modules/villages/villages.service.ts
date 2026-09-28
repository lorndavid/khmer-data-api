import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { redisCache } from '../../config/redis.js';
import { parsePagination } from '../../common/utils/pagination.js';
import { slugify } from '../../common/utils/slugify.js';
import { NotFoundError } from '../../common/errors/index.js';
import { ListVillagesQuery, CreateVillageInput, UpdateVillageInput } from './villages.schema.js';

export class VillagesService {
  async listVillages(query: ListVillagesQuery) {
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

    const cacheKey = `villages:list:${page}:${limit}:${query.commune_code || ''}:${query.commune_id || ''}:${query.district_code || ''}:${query.province_code || ''}:${query.search || ''}:${sort}:${order}:${query.active}`;
    const cached = await redisCache.get<{
      data: unknown[];
      pagination: { page: number; limit: number; total: number };
    }>(cacheKey);
    if (cached) return cached;

    const where: Prisma.VillageWhereInput = {};

    if (query.active !== undefined) {
      where.is_active = query.active;
    }

    if (query.commune_id) {
      where.commune_id = query.commune_id;
    }

    if (query.commune_code) {
      where.commune = { code: query.commune_code };
    }

    if (query.district_code) {
      where.commune = { district: { code: query.district_code } };
    }

    if (query.province_code) {
      where.commune = { district: { province: { code: query.province_code } } };
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

    const [total, villages] = await Promise.all([
      prisma.village.count({ where }),
      prisma.village.findMany({
        where,
        skip,
        take,
        orderBy: { [sort]: order },
        select: {
          id: true,
          code: true,
          commune_id: true,
          commune: {
            select: {
              id: true,
              code: true,
              name_km: true,
              name_en: true,
              slug: true,
              district: {
                select: {
                  id: true,
                  code: true,
                  name_km: true,
                  name_en: true,
                  slug: true,
                  province: {
                    select: {
                      id: true,
                      code: true,
                      name_km: true,
                      name_en: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
          name_km: true,
          name_en: true,
          slug: true,
          latitude: true,
          longitude: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      }),
    ]);

    const result = {
      data: villages,
      pagination: {
        page,
        limit,
        total,
      },
    };

    await redisCache.set(cacheKey, result, 3600);
    return result;
  }

  async getVillageByCode(codeOrSlug: string) {
    const cacheKey = `village:${codeOrSlug}`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const village = await prisma.village.findFirst({
      where: {
        OR: [{ code: codeOrSlug }, { slug: codeOrSlug.toLowerCase() }, { id: codeOrSlug }],
      },
      include: {
        commune: {
          include: {
            district: {
              include: {
                province: {
                  select: {
                    id: true,
                    code: true,
                    name_km: true,
                    name_en: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!village) {
      throw new NotFoundError('Village');
    }

    await redisCache.set(cacheKey, village, 3600);
    return village;
  }

  // Admin Mutations
  async createVillage(data: CreateVillageInput) {
    const slug = data.slug || slugify(data.name_en);

    const village = await prisma.village.create({
      data: {
        code: data.code,
        commune_id: data.commune_id,
        name_km: data.name_km,
        name_en: data.name_en,
        slug,
        latitude: data.latitude,
        longitude: data.longitude,
        is_active: data.is_active ?? true,
      },
    });

    await this.invalidateCache(village.code);
    return village;
  }

  async updateVillage(idOrCode: string, data: UpdateVillageInput) {
    const existing = await prisma.village.findFirst({
      where: { OR: [{ id: idOrCode }, { code: idOrCode }] },
    });

    if (!existing) {
      throw new NotFoundError('Village');
    }

    const slug = data.slug || (data.name_en ? slugify(data.name_en) : undefined);

    const updated = await prisma.village.update({
      where: { id: existing.id },
      data: {
        ...data,
        slug: slug !== undefined ? slug : existing.slug,
      },
    });

    await this.invalidateCache(existing.code);
    return updated;
  }

  async deleteVillage(idOrCode: string) {
    const existing = await prisma.village.findFirst({
      where: { OR: [{ id: idOrCode }, { code: idOrCode }] },
    });

    if (!existing) {
      throw new NotFoundError('Village');
    }

    await prisma.village.delete({
      where: { id: existing.id },
    });

    await this.invalidateCache(existing.code);
  }

  async invalidateCache(code?: string) {
    await redisCache.delByPattern('villages:*');
    await redisCache.delByPattern('communes:*');
    await redisCache.delByPattern('districts:*');
    await redisCache.delByPattern('provinces:*');
    await redisCache.delByPattern('locations:*');
    await redisCache.delByPattern('statistics:*');
    if (code) {
      await redisCache.del(`village:${code}`);
    }
  }
}

export const villagesService = new VillagesService();

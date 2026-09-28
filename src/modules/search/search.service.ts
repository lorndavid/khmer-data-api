import { prisma } from '../../config/database.js';
import { redisCache } from '../../config/redis.js';
import { SearchQueryInput } from './search.schema.js';

export interface SearchResultItem {
  type: 'province' | 'district' | 'commune' | 'village' | 'postal_code';
  id: string;
  code: string;
  name_km: string;
  name_en: string;
  slug?: string;
  parent_name_en?: string;
  parent_name_km?: string;
  score: number;
}

export class SearchService {
  async search(params: SearchQueryInput): Promise<SearchResultItem[]> {
    const query = params.q.trim();
    const type = params.type || 'all';
    const limit = params.limit || 20;

    const cacheKey = `search:${type}:${limit}:${query.toLowerCase()}`;
    const cached = await redisCache.get<SearchResultItem[]>(cacheKey);
    if (cached) return cached;

    const results: SearchResultItem[] = [];
    const queryLower = query.toLowerCase();

    // 1. Search Provinces
    if (type === 'all' || type === 'province') {
      const provinces = await prisma.province.findMany({
        where: {
          is_active: true,
          OR: [
            { code: { contains: query, mode: 'insensitive' } },
            { name_km: { contains: query, mode: 'insensitive' } },
            { name_en: { contains: query, mode: 'insensitive' } },
            { slug: { contains: queryLower, mode: 'insensitive' } },
          ],
        },
        take: limit,
      });

      for (const p of provinces) {
        results.push({
          type: 'province',
          id: p.id,
          code: p.code,
          name_km: p.name_km,
          name_en: p.name_en,
          slug: p.slug,
          parent_name_en: 'Cambodia',
          parent_name_km: 'កម្ពុជា',
          score: this.calculateRelevance(query, p.code, p.name_en, p.name_km, p.slug, 50),
        });
      }
    }

    // 2. Search Districts
    if (type === 'all' || type === 'district') {
      const districts = await prisma.district.findMany({
        where: {
          is_active: true,
          OR: [
            { code: { contains: query, mode: 'insensitive' } },
            { name_km: { contains: query, mode: 'insensitive' } },
            { name_en: { contains: query, mode: 'insensitive' } },
            { slug: { contains: queryLower, mode: 'insensitive' } },
          ],
        },
        include: {
          province: {
            select: { name_en: true, name_km: true },
          },
        },
        take: limit,
      });

      for (const d of districts) {
        results.push({
          type: 'district',
          id: d.id,
          code: d.code,
          name_km: d.name_km,
          name_en: d.name_en,
          slug: d.slug,
          parent_name_en: d.province.name_en,
          parent_name_km: d.province.name_km,
          score: this.calculateRelevance(query, d.code, d.name_en, d.name_km, d.slug, 40),
        });
      }
    }

    // 3. Search Communes
    if (type === 'all' || type === 'commune') {
      const communes = await prisma.commune.findMany({
        where: {
          is_active: true,
          OR: [
            { code: { contains: query, mode: 'insensitive' } },
            { name_km: { contains: query, mode: 'insensitive' } },
            { name_en: { contains: query, mode: 'insensitive' } },
            { slug: { contains: queryLower, mode: 'insensitive' } },
          ],
        },
        include: {
          district: {
            select: {
              name_en: true,
              name_km: true,
              province: { select: { name_en: true, name_km: true } },
            },
          },
        },
        take: limit,
      });

      for (const c of communes) {
        results.push({
          type: 'commune',
          id: c.id,
          code: c.code,
          name_km: c.name_km,
          name_en: c.name_en,
          slug: c.slug,
          parent_name_en: `${c.district.name_en}, ${c.district.province.name_en}`,
          parent_name_km: `${c.district.name_km}, ${c.district.province.name_km}`,
          score: this.calculateRelevance(query, c.code, c.name_en, c.name_km, c.slug, 30),
        });
      }
    }

    // 4. Search Villages
    if (type === 'all' || type === 'village') {
      const villages = await prisma.village.findMany({
        where: {
          is_active: true,
          OR: [
            { code: { contains: query, mode: 'insensitive' } },
            { name_km: { contains: query, mode: 'insensitive' } },
            { name_en: { contains: query, mode: 'insensitive' } },
            { slug: { contains: queryLower, mode: 'insensitive' } },
          ],
        },
        include: {
          commune: {
            select: {
              name_en: true,
              name_km: true,
              district: {
                select: {
                  name_en: true,
                  name_km: true,
                  province: { select: { name_en: true, name_km: true } },
                },
              },
            },
          },
        },
        take: limit,
      });

      for (const v of villages) {
        results.push({
          type: 'village',
          id: v.id,
          code: v.code,
          name_km: v.name_km,
          name_en: v.name_en,
          slug: v.slug,
          parent_name_en: `${v.commune.name_en}, ${v.commune.district.name_en}, ${v.commune.district.province.name_en}`,
          parent_name_km: `${v.commune.name_km}, ${v.commune.district.name_km}, ${v.commune.district.province.name_km}`,
          score: this.calculateRelevance(query, v.code, v.name_en, v.name_km, v.slug, 20),
        });
      }
    }

    // 5. Search Postal Codes
    if (type === 'all' || type === 'postal_code') {
      const postalCodes = await prisma.postalCode.findMany({
        where: {
          is_active: true,
          postal_code: { contains: query },
        },
        include: {
          province: { select: { name_en: true, name_km: true } },
          district: { select: { name_en: true, name_km: true } },
          commune: { select: { name_en: true, name_km: true } },
        },
        take: limit,
      });

      for (const pc of postalCodes) {
        const parentPartsEn = [
          pc.commune?.name_en,
          pc.district?.name_en,
          pc.province.name_en,
        ].filter(Boolean);
        const parentPartsKm = [
          pc.commune?.name_km,
          pc.district?.name_km,
          pc.province.name_km,
        ].filter(Boolean);

        results.push({
          type: 'postal_code',
          id: pc.id,
          code: pc.postal_code,
          name_km: `លេខកូដប្រៃសណីយ៍ ${pc.postal_code}`,
          name_en: `Postal Code ${pc.postal_code}`,
          parent_name_en: parentPartsEn.join(', '),
          parent_name_km: parentPartsKm.join(', '),
          score: pc.postal_code === query ? 100 : 70,
        });
      }
    }

    // Sort by relevance score descending
    results.sort((a, b) => b.score - a.score);

    const limitedResults = results.slice(0, limit);

    await redisCache.set(cacheKey, limitedResults, 3600);
    return limitedResults;
  }

  private calculateRelevance(
    query: string,
    code: string,
    nameEn: string,
    nameKm: string,
    slug: string,
    typeBonus = 0,
  ): number {
    const qLower = query.toLowerCase();
    const enLower = nameEn.toLowerCase();
    const slugLower = slug.toLowerCase();

    // Exact matches
    if (code.toLowerCase() === qLower) return 100 + typeBonus;
    if (nameKm === query) return 100 + typeBonus;
    if (enLower === qLower) return 100 + typeBonus;
    if (slugLower === qLower) return 95 + typeBonus;

    // Starts with
    if (code.startsWith(query)) return 85 + typeBonus;
    if (nameKm.startsWith(query)) return 85 + typeBonus;
    if (enLower.startsWith(qLower)) return 85 + typeBonus;

    // Contains
    if (enLower.includes(qLower)) return 65 + typeBonus;
    if (nameKm.includes(query)) return 65 + typeBonus;
    if (code.includes(query)) return 60 + typeBonus;

    return 30 + typeBonus;
  }
}

export const searchService = new SearchService();

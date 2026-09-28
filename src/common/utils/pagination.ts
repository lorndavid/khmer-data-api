export interface PaginationParams {
  page?: number | string;
  limit?: number | string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
  take: number;
  sort: string;
  order: 'asc' | 'desc';
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;
export const MAX_SEARCH_LENGTH = 100;

export function parsePagination(
  params: PaginationParams,
  defaultSort = 'created_at',
  defaultOrder: 'asc' | 'desc' = 'asc',
): ParsedPagination {
  const parsedPage = Math.max(1, parseInt(String(params.page || DEFAULT_PAGE), 10) || DEFAULT_PAGE);
  const rawLimit = parseInt(String(params.limit || DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
  const parsedLimit = Math.min(Math.max(1, rawLimit), MAX_LIMIT);

  const skip = (parsedPage - 1) * parsedLimit;
  const take = parsedLimit;

  const sort = params.sort ? String(params.sort).trim() : defaultSort;
  const order: 'asc' | 'desc' = params.order?.toLowerCase() === 'desc' ? 'desc' : defaultOrder;

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
    take,
    sort,
    order,
  };
}

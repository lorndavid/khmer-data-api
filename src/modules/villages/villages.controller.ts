import { Request, Response, NextFunction } from 'express';
import { villagesService } from './villages.service.js';
import { sendCollection, sendSuccess } from '../../common/utils/response.js';
import { ListVillagesQuery } from './villages.schema.js';

export async function listVillages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawQuery = req.query as unknown as ListVillagesQuery;
    const query: ListVillagesQuery = {
      ...rawQuery,
      commune_code: (req.params.communeCode as string) || rawQuery.commune_code,
    };
    const result = await villagesService.listVillages(query);
    sendCollection(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
}

export async function getVillageByCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const village = await villagesService.getVillageByCode(req.params.code);
    sendSuccess(res, village);
  } catch (error) {
    next(error);
  }
}

import { Request, Response, NextFunction } from 'express';
import { communesService } from './communes.service.js';
import { sendCollection, sendSuccess } from '../../common/utils/response.js';
import { ListCommunesQuery } from './communes.schema.js';

export async function listCommunes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawQuery = req.query as unknown as ListCommunesQuery;
    const query: ListCommunesQuery = {
      ...rawQuery,
      district_code: (req.params.districtCode as string) || rawQuery.district_code,
    };
    const result = await communesService.listCommunes(query);
    sendCollection(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
}

export async function getCommuneByCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const commune = await communesService.getCommuneByCode(req.params.code);
    sendSuccess(res, commune);
  } catch (error) {
    next(error);
  }
}

export async function getCommuneVillages(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const code = req.params.code || req.params.communeCode;
    const result = await communesService.getCommuneVillages(code);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

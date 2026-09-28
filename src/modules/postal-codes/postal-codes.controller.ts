import { Request, Response, NextFunction } from 'express';
import { postalCodesService } from './postal-codes.service.js';
import { sendCollection, sendSuccess } from '../../common/utils/response.js';

export async function listPostalCodes(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await postalCodesService.listPostalCodes(req.query);
    sendCollection(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
}

export async function getPostalCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await postalCodesService.getPostalCode(req.params.postalCode);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

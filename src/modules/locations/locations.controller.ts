import { Request, Response, NextFunction } from 'express';
import { locationsService } from './locations.service.js';
import { sendSuccess } from '../../common/utils/response.js';

export async function getLocationByCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const hierarchy = await locationsService.getLocationHierarchyByCode(req.params.code);
    sendSuccess(res, hierarchy);
  } catch (error) {
    next(error);
  }
}

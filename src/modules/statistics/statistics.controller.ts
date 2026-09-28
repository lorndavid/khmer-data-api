import { Request, Response, NextFunction } from 'express';
import { statisticsService } from './statistics.service.js';
import { sendSuccess } from '../../common/utils/response.js';

export async function getStatistics(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const stats = await statisticsService.getStatistics();
    sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
}

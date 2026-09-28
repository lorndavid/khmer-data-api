import { Request, Response, NextFunction } from 'express';
import { searchService } from './search.service.js';
import { sendSuccess } from '../../common/utils/response.js';

export async function search(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const results = await searchService.search(
      req.query as unknown as {
        q: string;
        type?: 'all' | 'province' | 'district' | 'commune' | 'village' | 'postal_code';
        limit?: number;
      },
    );
    sendSuccess(res, results, 200, {
      query: req.query.q,
      count: results.length,
    });
  } catch (error) {
    next(error);
  }
}

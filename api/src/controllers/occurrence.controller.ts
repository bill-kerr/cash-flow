import express, { Request, Response } from 'express';
import { HttpResponse } from '../types/http-response';
import { requireAuth } from '../middleware/require-auth.middleware';
import { handleValidationResult } from '../middleware/validation-handler.middleware';
import { queryDateRangeValidator } from '../middleware/validators/date-range.validator';
import { occurrenceService } from '../services/occurrence.service';

const router = express.Router();

router.get(
  '/',
  requireAuth,
  queryDateRangeValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const occurrences = await occurrenceService
      .getOccurrencesByUser(req.currentUserId, startDate.toString(), endDate.toString());
    
    const resData = {
      object: 'list',
      data: occurrences
    };
    res.status(HttpResponse.OK).send(resData);
  }
);

export { router as occurrenceRouter };
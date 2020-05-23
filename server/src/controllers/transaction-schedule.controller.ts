import express, { Request, Response } from 'express';

import { HttpResponse } from '../util/http-response';
import { handleValidationResult } from '../middleware/validation-handler.middleware';
import { transactionScheduleService } from '../services/transaction-schedule.service';
import { createTransactionScheduleValidator } from '../middleware/validators/transaction-schedule.validator';
import { requireAuth } from '../middleware/require-auth.middleware';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.sendStatus(HttpResponse.OK);
});

router.post('/',
  requireAuth,
  createTransactionScheduleValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const data = { ...req.body, userId: req.currentUserId }
    const transactionSchedule = await transactionScheduleService.createTransactionSchedule(data);
    res.status(HttpResponse.CREATED).send(transactionSchedule);
  }
);

export { router as transactionScheduleRouter };
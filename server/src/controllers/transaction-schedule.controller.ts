import express, { Request, Response } from 'express';
import { HttpResponse } from '../types/http-response';
import { handleValidationResult } from '../middleware/validation-handler.middleware';
import { transactionScheduleService } from '../services/transaction-schedule.service';
import { createTransactionScheduleValidator } from '../middleware/validators/transaction-schedule.validator';
import { requireAuth } from '../middleware/require-auth.middleware';
import { transactionService } from '../services/transaction.service';

const router = express.Router();

router.get(
  '/',
  requireAuth,
  async (req: Request, res: Response) => {
    const transactionSchedules = await transactionScheduleService.getTransactionSchedules(req.currentUserId!);

    const resData = {
      object: 'list',
      data: [...transactionSchedules]
    };
    res.status(HttpResponse.OK).send(resData);
  }
);

router.post(
  '/',
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
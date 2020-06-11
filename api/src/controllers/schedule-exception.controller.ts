import express, { Request, Response } from 'express';
import { HttpResponse } from '../types/http-response';
import { requireAuth } from '../middleware/require-auth.middleware';
import { scheduleExceptionService } from '../services/schedule-exception.service';
import { requireOwnership } from '../middleware/require-ownership.middleware';
import { ScheduleException } from '../models/schedule-exception.model';
import { createScheduleExceptionValidator } from '../middleware/validators/schedule-exception.validator';
import { handleValidationResult } from '../middleware/validation-handler.middleware';
import { Schedule } from '../models/schedule.model';
import { optionalQueryDateRangeValidator } from '../middleware/validators/date-range.validator';

const router = express.Router();

router.get(
  '/',
  requireAuth,
  optionalQueryDateRangeValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const exceptions = await scheduleExceptionService
      .getScheduleExceptionsByUser(req.currentUserId, startDate as string, endDate as string);

    const resData = {
      object: 'list',
      data: exceptions
    };
    res.status(HttpResponse.OK).send(resData);
  }
);

router.get(
  '/:id',
  requireAuth,
  requireOwnership(ScheduleException, 'params', 'id'),
  async (req: Request, res: Response) => {
    const exception = await scheduleExceptionService.getScheduleExceptionById(req.params.id);
    res.status(HttpResponse.OK).send(exception);
  }
);

router.post(
  '/',
  requireAuth,
  requireOwnership(Schedule, 'body', 'schedule', 'id'),
  createScheduleExceptionValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const data = { ...req.body, userId: req.currentUserId };
    const exception = await scheduleExceptionService.createScheduleException(data);
    res.status(HttpResponse.CREATED).send(exception);
  }
);

router.delete(
  '/:id',
  requireAuth,
  requireOwnership(ScheduleException, 'params', 'id'),
  async (req: Request, res: Response) => {
    const exception = await scheduleExceptionService.deleteScheduleException(req.params.id);
    res.status(HttpResponse.OK).send(exception);
  }
);

export { router as scheduleExceptionRouter };
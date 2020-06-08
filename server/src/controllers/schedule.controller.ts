import express, { Request, Response } from 'express';
import { HttpResponse } from '../types/http-response';
import { handleValidationResult } from '../middleware/validation-handler.middleware';
import { scheduleService } from '../services/schedule.service';
import { scheduleExceptionService } from '../services/schedule-exception.service';
import { createScheduleValidator } from '../middleware/validators/schedule.validator';
import { requireAuth } from '../middleware/require-auth.middleware';
import { getOccurrencesValidator } from '../middleware/validators/occurrence.validator';
import { requireOwnership } from '../middleware/require-ownership.middleware';
import { Schedule } from '../models/schedule.model';
import { createScheduleExceptionValidator } from '../middleware/validators/schedule-exception.validator';

const router = express.Router();

router.get(
  '/',
  requireAuth,
  async (req: Request, res: Response) => {
    const schedules = await scheduleService.getSchedules(req.currentUserId!);

    const resData = {
      object: 'list',
      data: schedules
    };
    res.status(HttpResponse.OK).send(resData);
  }
);

router.post(
  '/',
  requireAuth,
  createScheduleValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const data = { ...req.body, userId: req.currentUserId }
    const schedule = await scheduleService.createSchedule(data);
    res.status(HttpResponse.CREATED).send(schedule);
  }
);

router.get(
  '/:id',
  requireAuth,
  requireOwnership(Schedule, 'id'),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const schedule = await scheduleService.getScheduleById(id);
    res.status(HttpResponse.OK).send(schedule);
  }
);

router.get(
  '/:id/occurences',
  requireAuth,
  requireOwnership(Schedule, 'id'),
  getOccurrencesValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    const occurrences = await scheduleService.getScheduleOccurences(
      id, 
      startDate.toString(), 
      endDate.toString(), 
      req.currentUserId
    );

    const resData = {
      object: 'list',
      data: occurrences
    };
    res.status(HttpResponse.OK).send(resData);
  }
);

router.post(
  '/:id/schedule-exceptions',
  requireAuth,
  requireOwnership(Schedule, 'id'),
  createScheduleExceptionValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const schedule = req.params.id;
    const exception = await scheduleExceptionService.createScheduleException({ ...req.body, schedule });
    res.status(HttpResponse.CREATED).send(exception);
  }
);

export { router as scheduleRouter };
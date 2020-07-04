import express, { Request, Response } from 'express';
import { HttpResponse } from '../types/http-response';
import { handleValidationResult } from '../middleware/validation-handler.middleware';
import { scheduleService } from '../services/schedule.service';
import { scheduleExceptionService } from '../services/schedule-exception.service';
import { createScheduleValidator, editScheduleValidator } from '../middleware/validators/schedule.validator';
import { requireAuth } from '../middleware/require-auth.middleware';
import { queryDateRangeValidator, optionalQueryDateRangeValidator } from '../middleware/validators/date-range.validator';
import { requireOwnership } from '../middleware/require-ownership.middleware';
import { Schedule } from '../models/schedule.model';
import { createScheduleExceptionByScheduleValidator } from '../middleware/validators/schedule-exception.validator';

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
  requireOwnership(Schedule, 'params', 'id'),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const schedule = await scheduleService.getScheduleById(id);
    res.status(HttpResponse.OK).send(schedule);
  }
);

router.get(
  '/:id/occurrences',
  requireAuth,
  requireOwnership(Schedule, 'params', 'id'),
  queryDateRangeValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    const occurrences = await scheduleService.getScheduleOccurrences(
      id, 
      startDate.toString(), 
      endDate.toString()
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
  requireOwnership(Schedule, 'params', 'id'),
  createScheduleExceptionByScheduleValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const schedule = req.params.id;
    const exception = await scheduleExceptionService.createScheduleException({ 
      ...req.body,
      userId: req.currentUserId, 
      schedule
    });
    res.status(HttpResponse.CREATED).send(exception);
  }
);

router.get(
  '/:id/schedule-exceptions',
  requireAuth,
  requireOwnership(Schedule, 'params', 'id'),
  optionalQueryDateRangeValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const scheduleId = req.params.id;
    const exceptions = await scheduleExceptionService.getScheduleExceptionsBySchedule(scheduleId);
    
    const resData = {
      object: 'list',
      data: exceptions
    };
    res.status(HttpResponse.OK).send(resData);
  }
);

router.delete(
  '/:id',
  requireAuth,
  requireOwnership(Schedule, 'params', 'id'),
  async (req: Request, res: Response) => {
    const schedule = await scheduleService.deleteSchedule(req.params.id);
    res.status(HttpResponse.OK).send(schedule);
  }
);

router.put(
  '/:id',
  requireAuth,
  requireOwnership(Schedule, 'params', 'id'),
  editScheduleValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const data = { ...req.body, id: req.params.id };
    const schedule = await scheduleService.editSchedule(data);
    res.status(HttpResponse.OK).send(schedule);
  }
);

export { router as scheduleRouter };
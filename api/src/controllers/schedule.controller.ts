import express, { Request, Response } from 'express';
import { HttpResponse } from '../types';
import { handleValidationResult, requireAuth, requireOwnership } from '../middleware';
import { scheduleService, scheduleExceptionService } from '../services';
import { Schedule } from '../models';
import { 
  createScheduleValidator, 
  editScheduleValidator,
  queryDateRangeValidator,
  optionalQueryDateRangeValidator,
  createScheduleExceptionByScheduleValidator
} from '../middleware/validators';

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
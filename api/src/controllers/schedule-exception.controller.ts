import express, { Request, Response } from 'express';
import { requireAuth, requireOwnership, handleValidationResult } from '../middleware';
import { scheduleExceptionService } from '../services';
import { Schedule, ScheduleException } from '../models';
import { EditScheduleExceptionDto, CreateScheduleExceptionDto, HttpResponse } from '../types';
import { 
  createScheduleExceptionValidator, 
  editScheduleExceptionValidator,
  optionalQueryDateRangeValidator 
} from '../middleware/validators';

const router = express.Router();

router.get(
  '/',
  requireAuth,
  optionalQueryDateRangeValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const exceptions = await scheduleExceptionService
      .getScheduleExceptionsByUser(req.currentUserId);

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
    const data: CreateScheduleExceptionDto = { ...req.body, userId: req.currentUserId };
    const exception = await scheduleExceptionService.createScheduleException(data);
    res.status(HttpResponse.CREATED).send(exception);
  }
);

router.put(
  '/:id',
  requireAuth,
  requireOwnership(ScheduleException, 'params', 'id'),
  editScheduleExceptionValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const data: EditScheduleExceptionDto = { ...req.body, id: req.params.id };
    const exception = await scheduleExceptionService.editScheduleException(data);
    res.status(HttpResponse.OK).send(exception);
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
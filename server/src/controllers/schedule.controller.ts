import express, { Request, Response } from 'express';
import { HttpResponse } from '../types/http-response';
import { handleValidationResult } from '../middleware/validation-handler.middleware';
import { scheduleService } from '../services/schedule.service';
import { createScheduleValidator } from '../middleware/validators/schedule.validator';
import { requireAuth } from '../middleware/require-auth.middleware';

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
    const Schedule = await scheduleService.createSchedule(data);
    res.status(HttpResponse.CREATED).send(Schedule);
  }
);

export { router as scheduleRouter };
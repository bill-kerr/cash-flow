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

router.get(
  '/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const schedule = await scheduleService.getScheduleById(id, req.currentUserId);
    res.status(HttpResponse.OK).send(schedule);
  }
);

router.get(
  '/:id/occurences',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await scheduleService.getScheduleOccurences(id, 'test', 'test', req.currentUserId);
    res.sendStatus(200);
  }
)

export { router as scheduleRouter };
import { Router } from "express";

interface Controller {
  router(): Router;
}

export interface IScheduleController extends Controller {
  getSchedules(req: Request, res: Response): Promise<void>;
  getSchedule(req: Request, res: Response): Promise<void>;
  getOccurrences(req: Request, res: Response): Promise<void>;
  getExceptions(req: Request, res: Response): Promise<void>;
  createSchedule(req: Request, res: Response): Promise<void>;
  createException(req: Request, res: Response): Promise<void>;
  updateSchedule(req: Request, res: Response): Promise<void>;
  deleteSchedule(req: Request, res: Response): Promise<void>;
}

export interface IExceptionController extends Controller {
  getException(req: Request, res: Response): Promise<void>;
  getExceptions(req: Request, res: Response): Promise<void>;
  createException(req: Request, res: Response): Promise<void>;
  updateException(req: Request, res: Response): Promise<void>;
  deleteException(req: Request, res: Response): Promise<void>;
}

export interface IOccurrenceController extends Controller {}

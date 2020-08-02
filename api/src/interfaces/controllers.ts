import { Router } from "express";
import { HttpRequest, HttpResponse } from "./http";
import { Schedule, Occurrence, Exception } from "../entities";

interface Controller {
  router(): Router;
}

export type RequestHandler<T> = (req: HttpRequest) => Promise<HttpResponse<T>>;

export interface IScheduleController extends Controller {
  getSchedules: RequestHandler<Schedule[]>;
  getSchedule: RequestHandler<Schedule>;
  getOccurrences: RequestHandler<Schedule>;
  getExceptions: RequestHandler<Exception[]>;
  createSchedule: RequestHandler<Schedule>;
  createException: RequestHandler<Exception>;
  updateSchedule: RequestHandler<Schedule>;
  deleteSchedule: RequestHandler<Schedule>;
}

export interface IExceptionController extends Controller {
  getException: RequestHandler<Exception>;
  getExceptions: RequestHandler<Exception[]>;
  createException: RequestHandler<Exception>;
  updateException: RequestHandler<Exception>;
  deleteException: RequestHandler<Exception>;
}

export interface IOccurrenceController extends Controller {
  getOccurrences: RequestHandler<Occurrence[]>;
}

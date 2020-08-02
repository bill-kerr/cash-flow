import { Router } from "express";
import { HttpRequest, ListResponse } from "./http";
import { Occurrence, Exception, Schedule } from "../entities";

interface Controller {
  router(): Router;
}

export interface IScheduleController extends Controller {
  getSchedules(req: HttpRequest): Promise<ListResponse<Schedule>>;
  getSchedule(req: HttpRequest): Promise<Schedule>;
  getOccurrences(req: HttpRequest): Promise<ListResponse<Occurrence>>;
  getExceptions(req: HttpRequest): Promise<ListResponse<Exception>>;
  createSchedule(req: HttpRequest): Promise<Schedule>;
  createException(req: HttpRequest): Promise<Exception>;
  updateSchedule(req: HttpRequest): Promise<Schedule>;
  deleteSchedule(req: HttpRequest): Promise<Schedule>;
}

export interface IExceptionController extends Controller {
  getException(req: HttpRequest): Promise<Exception>;
  getExceptions(req: HttpRequest): Promise<ListResponse<Exception>>;
  createException(req: HttpRequest): Promise<Exception>;
  updateException(req: HttpRequest): Promise<Exception>;
  deleteException(req: HttpRequest): Promise<Exception>;
}

export interface IOccurrenceController extends Controller {
  getOccurrences(req: HttpRequest): Promise<ListResponse<Occurrence>>;
}

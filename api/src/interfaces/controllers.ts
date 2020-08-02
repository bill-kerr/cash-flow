import { Router, RequestHandler } from "express";

interface Controller {
  router(): Router;
}

export interface IScheduleController extends Controller {
  getSchedules: RequestHandler;
  getSchedule: RequestHandler;
  getOccurrences: RequestHandler;
  getExceptions: RequestHandler;
  createSchedule: RequestHandler;
  createException: RequestHandler;
  updateSchedule: RequestHandler;
  deleteSchedule: RequestHandler;
}

export interface IExceptionController extends Controller {
  getExceptions: RequestHandler;
  getException: RequestHandler;
  createException: RequestHandler;
  updateException: RequestHandler;
  deleteException: RequestHandler;
}

export interface IOccurrenceController extends Controller {
  getOccurrences: RequestHandler;
}

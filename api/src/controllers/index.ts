import { Router } from "express";

export { OccurrenceController } from "./occurrence";
export { ExceptionController } from "./exception";
export { ScheduleController } from "./schedule";

export interface Controller {
  router(): Router;
}

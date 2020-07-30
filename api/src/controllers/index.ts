import { Router } from "express";

export { occurrenceRouter } from "./occurrence";
export { exceptionRouter } from "./exception";
export { scheduleRouter } from "./schedule";

export interface Controller {
  router(): Router;
}

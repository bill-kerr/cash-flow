import express, { Application } from "express";
import { json } from "body-parser";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import { NotFoundError } from "../errors";
import { errorHandler, verifyJsonMediaType, requestMethodChecker } from "../middleware";
import { ScheduleController } from "../controllers/schedule";
import { ScheduleService } from "../services/schedule";
import { getRepository } from "typeorm";
import { Schedule, Exception } from "../entities";
import { ExceptionService, OccurrenceService } from "../services";
import { ExceptionController } from "../controllers/exception";
import { OccurrenceController } from "../controllers/occurrence";

function init(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(json());
  app.use(requestMethodChecker);
  app.use(verifyJsonMediaType);

  const scheduleService = new ScheduleService(getRepository(Schedule));
  const exceptionService = new ExceptionService(scheduleService, getRepository(Exception));
  const occurrenceService = new OccurrenceService(exceptionService);
  const scheduleController = new ScheduleController(scheduleService, exceptionService, occurrenceService);
  const exceptionController = new ExceptionController(exceptionService);
  const occurrenceController = new OccurrenceController(scheduleService, occurrenceService);

  const routerV1 = express.Router();
  routerV1.use("/schedules", scheduleController.router());
  routerV1.use("/exceptions", exceptionController.router());
  routerV1.use("/occurrences", occurrenceController.router());
  app.use("/api/v1", routerV1);

  app.all("*", () => {
    throw new NotFoundError("The specified endpoint does not exist.");
  });

  app.use(errorHandler);
  return app;
}

export { init as initExpressApp };

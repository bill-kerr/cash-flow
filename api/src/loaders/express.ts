import express, { Application, Request, Response } from "express";
import { json } from "body-parser";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import { NotFoundError } from "../errors";
import { errorHandler, verifyJsonMediaType, requestMethodChecker } from "../middleware";
import { getRepository } from "typeorm";
import { Schedule, Exception } from "../entities";
import { ExceptionService, OccurrenceService, ScheduleService } from "../services";
import { ExceptionController, ScheduleController, OccurrenceController } from "../controllers";
import { HttpRequest, HttpResponse } from "../interfaces";

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

function expressWrapper(handler: (httpRequest: HttpRequest) => Promise<HttpResponse<any>>) {
  return async (req: Request, res: Response) => {
    const httpRequest = makeHttpRequest(req);
    const result = await handler(httpRequest);
    res.status(result.status).send(result.data);
  };
}

function makeHttpRequest(req: Request): HttpRequest {
  const querystring = req.baseUrl.split("?")[1];
  const query = new URLSearchParams(querystring);
  return {
    query,
    url: req.url,
    body: req.body,
    userId: req.userId,
    method: req.method,
  };
}

export { init as initExpressApp };

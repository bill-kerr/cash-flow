import express, { Application, Request, Response } from "express";
import { json } from "body-parser";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import { NotFoundError } from "../errors";
import { errorHandler, verifyJsonMediaType, requestMethodChecker } from "../middleware";
import { scheduleRouter, exceptionRouter, occurrenceRouter } from "../controllers";

function init(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(json());
  app.use(requestMethodChecker);
  app.use(verifyJsonMediaType);

  app.use("/api/v1/schedules", scheduleRouter);
  app.use("/api/v1/exceptions", exceptionRouter);
  app.use("/api/v1/occurrences", occurrenceRouter);

  app.all("*", (req: Request, res: Response) => {
    throw new NotFoundError("The specified endpoint does not exist.");
  });

  app.use(errorHandler);
  return app;
}

export { init as initExpressApp };

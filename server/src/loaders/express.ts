import express, { Application, Request, Response } from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';

import { NotFoundError } from '../errors/not-found-error';
import { errorHandler } from '../middleware/error-handler.middleware';
import { verifyJsonMediaType } from '../middleware/verify-json-media-type.middleware';
import { scheduleRouter } from '../controllers/schedule.controller';
import { requestMethodChecker } from '../middleware/request-method-checker.middleware';

function init(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(json());
  app.use(requestMethodChecker);
  app.use(verifyJsonMediaType);

  // Example auth code
  // app.get('/api/v1', async (req: Request, res: Response) => {
  //   try {
  //     const token = req.headers['authentication']!.toString().split(' ')[1];
  //     const user = await admin.auth().verifyIdToken(token);
  //     res.send(user.email)
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  app.use('/api/v1/schedules', scheduleRouter);
  app.all('*', (req: Request, res: Response) => {
    throw new NotFoundError('The specified endpoint does not exist.');
  });

  app.use(errorHandler);
  return app;
}

export { init as initExpressApp };
import express, { Application, Request, Response } from 'express';
import { json } from 'body-parser';
import 'express-async-errors';

import { userRouter } from '../controllers/user.controller';
import { NotFoundError } from '../errors/not-found-error';
import { errorHandler } from '../middleware/error-handler';

function init(): Application {
  const app = express();

  app.use(json());
  app.use('/api/v1/users', userRouter);

  app.all('*', (req: Request, res: Response) => {
    throw new NotFoundError('The specified endpoint does not exist.');
  });

  app.use(errorHandler);
  return app;
}

export { init as initExpressApp };
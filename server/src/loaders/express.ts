import express, { Application, Request, Response } from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cors from 'cors';

import * as admin from 'firebase-admin';

import { NotFoundError } from '../errors/not-found-error';
import { errorHandler } from '../middleware/error-handler.middleware';

function init(): Application {
  const app = express();

  app.use(cors());
  app.use(json());

  app.get('/api/v1', async (req: Request, res: Response) => {
    try {
      const token = req.headers['authentication']!.toString().split(' ')[1];
      const user = await admin.auth().verifyIdToken(token);
      res.send(user.email)
    } catch (err) {
      console.log(err);
    }
  });

  app.all('*', (req: Request, res: Response) => {
    throw new NotFoundError('The specified endpoint does not exist.');
  });

  app.use(errorHandler);
  return app;
}

export { init as initExpressApp };
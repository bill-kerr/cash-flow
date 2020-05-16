import express, { Request, Response } from 'express';

import HttpResponse from '../util/http-response';

const router = express.Router();

router.get('/test', (req: Request, res: Response) => {
  res.sendStatus(HttpResponse.OK);
});

export { router as userRouter };

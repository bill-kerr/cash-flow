import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import HttpResponse from '../util/http-response';
import { UserService } from '../services/user.service';
import { validateCreateUser } from '../middleware/validators/user.validator';
import { handleValidationResult } from '../middleware/validation-handler.middleware';

const router = express.Router();

router.get('/test', (req: Request, res: Response) => {
  res.sendStatus(HttpResponse.OK);
});

router.post(
  '/',
  validateCreateUser,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const user = await UserService.createUser(req.body);
    res.status(HttpResponse.CREATED).send(user);
  }
);

export { router as userRouter };

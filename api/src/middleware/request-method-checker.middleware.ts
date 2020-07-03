import { Request, Response, NextFunction } from 'express';
import { MethodNotAllowedError } from '../errors';

const requestMethodChecker = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.method !== 'GET' &&
    req.method !== 'POST' &&
    req.method !== 'PUT' &&
    req.method !== 'DELETE'
  ) {
    throw new MethodNotAllowedError();
  }

  next();
}

export { requestMethodChecker };
import { Request, Response, NextFunction } from 'express';

const requestSanitizer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  

  next();
}

export { requestSanitizer };
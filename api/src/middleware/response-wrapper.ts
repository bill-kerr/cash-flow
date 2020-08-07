import { Request, Response, NextFunction } from "express";

export function responseWrapper(_req: Request, res: Response, next: NextFunction) {
  res.sendRes = (body: any, status = 200) => {
    res.status(status).send(body);
  };
  next();
}

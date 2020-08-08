import { Request, Response, NextFunction } from "express";
import { classToPlain } from "class-transformer";
import { HttpResponse } from "../types";

export function responseWrapper(_req: Request, res: Response, next: NextFunction) {
  res.sendRes = (body: any, status = HttpResponse.OK) => {
    res.status(status).send(transform(body));
  };
  next();
}

function transform(body: any) {
  return Array.isArray(body)
    ? { object: "list", data: body.map((item: any) => classToPlain(item)) }
    : classToPlain(body);
}

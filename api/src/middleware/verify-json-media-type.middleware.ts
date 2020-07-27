import { Request, Response, NextFunction } from "express";
import { UnsupportedMediaTypeError } from "../errors";

const verifyJsonMediaType = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers["content-type"];

  if (contentType !== "application/json" && (req.method === "POST" || req.method === "PUT")) {
    throw new UnsupportedMediaTypeError();
  }

  next();
};

export { verifyJsonMediaType };

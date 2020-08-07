import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "../types";
import { BaseError, ErrorResponse } from "../errors";

const defaultError = (requestUrl: string): ErrorResponse => ({
  object: "list",
  statusCode: HttpResponse.INTERNAL_SERVER_ERROR,
  requestUrl,
  errors: [
    {
      object: "error-detail",
      title: "Internal server error",
      detail: "An unknown error occurred.",
    },
  ],
});

function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof BaseError) {
    const errorResponse: ErrorResponse = {
      object: "list",
      statusCode: err.statusCode,
      requestUrl: req.url,
      errors: err.serializeErrors(),
    };

    return res.status(err.statusCode).send(errorResponse);
  }

  if (err instanceof SyntaxError) {
    const errorResponse: ErrorResponse = {
      object: "list",
      statusCode: HttpResponse.BAD_REQUEST,
      requestUrl: req.originalUrl,
      errors: [
        {
          object: "error-detail",
          title: "Syntax error",
          detail: "Request contained invalid JSON.",
        },
      ],
    };

    return res.status(HttpResponse.BAD_REQUEST).send(errorResponse);
  }

  console.error(err);
  return res.status(HttpResponse.INTERNAL_SERVER_ERROR).send(defaultError(req.originalUrl));
}

export { errorHandler };

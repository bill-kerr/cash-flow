import { Request, Response, NextFunction } from 'express';

import { HttpResponse } from '../types/http-response';
import { BaseError } from '../errors/base-error'
import { ErrorResponse } from '../errors/error-response';

const defaultError: ErrorResponse = {
  object: 'error',
  statusCode: HttpResponse.INTERNAL_SERVER_ERROR,
  errors: [{
    object: 'error-detail',
    title: 'Internal server error',
    detail: 'An unknown error occured.'
  }]
};

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof BaseError) {
    const errorResponse: ErrorResponse = {
      object: 'error',
      statusCode: err.statusCode,
      errors: err.serializeErrors()
    };

    return res.status(err.statusCode).send(errorResponse);
  }

  if (err instanceof SyntaxError) {
    const errorResponse: ErrorResponse = {
      object: 'error',
      statusCode: HttpResponse.BAD_REQUEST,
      errors: [{
        object: 'error-detail',
        title: 'Syntax error',
        detail: 'Request contained invalid JSON.'
      }]
    };

    return res.status(HttpResponse.BAD_REQUEST).send(errorResponse);
  }

  console.error(err);
  res.status(HttpResponse.INTERNAL_SERVER_ERROR).send(defaultError);
}

export { errorHandler };
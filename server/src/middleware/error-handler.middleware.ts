import { Request, Response, NextFunction } from 'express';

import HttpResponse from '../util/http-response';
import { BaseError } from '../errors/base-error'
import { ErrorResponse } from '../errors/error-response';

const defaultError: ErrorResponse = {
  object: 'error',
  statusCode: HttpResponse.INTERNAL_SERVER_ERROR,
  errors: [{
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
    }

    return res.status(err.statusCode).send(errorResponse);
  }

  res.status(HttpResponse.INTERNAL_SERVER_ERROR).send(defaultError);
}

export { errorHandler };
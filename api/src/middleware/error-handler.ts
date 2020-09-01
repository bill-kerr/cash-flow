import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../types';
import { BaseError, ErrorResponse } from '../errors';

const defaultError = (requestUrl: string): ErrorResponse => ({
  object: 'error',
  statusCode: HttpResponse.INTERNAL_SERVER_ERROR,
  requestUrl,
  errors: [
    {
      object: 'error-detail',
      title: 'Internal server error',
      detail: 'An unknown error occurred.',
    },
  ],
});

function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof BaseError) {
    const errorResponse: ErrorResponse = {
      object: 'error',
      statusCode: err.statusCode,
      requestUrl: req.url,
      errors: err.serializeErrors(),
    };

    return res.sendRes(errorResponse, err.statusCode);
  }

  if (err instanceof SyntaxError) {
    const errorResponse: ErrorResponse = {
      object: 'error',
      statusCode: HttpResponse.BAD_REQUEST,
      requestUrl: req.originalUrl,
      errors: [
        {
          object: 'error-detail',
          title: 'Syntax error',
          detail: 'Request contained invalid JSON.',
        },
      ],
    };

    return res.sendRes(errorResponse, HttpResponse.BAD_REQUEST);
  }

  console.error(err);
  res.sendRes(defaultError(req.originalUrl), HttpResponse.INTERNAL_SERVER_ERROR);
}

export { errorHandler };

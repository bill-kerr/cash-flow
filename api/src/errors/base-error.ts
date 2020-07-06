import { HttpResponse } from '../types';

export interface SerializedError {
  object: 'error-detail',
  title: string,
  detail: string
}

export abstract class BaseError extends Error {
  abstract statusCode: HttpResponse;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serializeErrors(): SerializedError[]
}
import { HttpResponse } from '../util/http-response';

export interface SerializedError {
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
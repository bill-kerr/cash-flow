import { BaseError, SerializedError } from './base-error';
import { HttpResponse } from '../util/http-response';

class BadRequestError extends BaseError {
  statusCode = HttpResponse.BAD_REQUEST;
  error: SerializedError = {
    title: 'Bad request',
    detail: ''
  };

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
    this.error.detail = message;
  }

  serializeErrors() {
    return [ this.error ];
  }
}

export { BadRequestError };
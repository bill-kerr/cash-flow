import { BaseError, SerializedError } from './base-error';
import HttpResponse from '../util/http-response';

class NotFoundError extends BaseError {
  statusCode = HttpResponse.NOT_FOUND;
  error: SerializedError = {
    title: 'Not found',
    detail: ''
  };

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.error.detail = message;
  }

  serializeErrors() {
    return [ this.error ];
  }
}

export { NotFoundError };
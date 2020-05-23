import { BaseError, SerializedError } from './base-error';
import { HttpResponse } from '../util/http-response';

class NotAuthorizedError extends BaseError {
  statusCode = HttpResponse.UNAUTHORIZED;
  error: SerializedError = {
    title: 'Not authorized',
    detail: ''
  };

  constructor(message = 'User is not authorized.') {
    super(message);
    this.error.detail = message;
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [ this.error ];
  }
}

export { NotAuthorizedError };
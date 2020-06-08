import { BaseError, SerializedError } from './base-error';
import { HttpResponse } from '../types/http-response';

class NotAuthorizedError extends BaseError {
  statusCode = HttpResponse.UNAUTHORIZED;
  error: SerializedError = {
    object: 'error-detail',
    title: 'Not authorized',
    detail: ''
  };

  constructor(message = 'User is not authorized to access this resource.') {
    super(message);
    this.error.detail = message;
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [ this.error ];
  }
}

export { NotAuthorizedError };
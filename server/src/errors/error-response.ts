import { HttpResponse } from '../types/http-response';
import { SerializedError } from './base-error';

interface ErrorResponse {
  object: 'error'
  statusCode: HttpResponse
  errors: SerializedError[]
}

export { ErrorResponse };
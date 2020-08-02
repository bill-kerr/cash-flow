import { BaseError, SerializedError } from "./base-error";
import { HttpResponse } from "../interfaces";

class MethodNotAllowedError extends BaseError {
  statusCode = HttpResponse.METHOD_NOT_ALLOWED;
  error: SerializedError = {
    object: "error-detail",
    title: "Method not allowed",
    detail: "Request was made with a bad HTTP method. Only GET, POST, PUT, and DELETE methods are allowed.",
  };

  constructor() {
    super("Request was made with a bad HTTP method. Only GET, POST, PUT, and DELETE methods are allowed.");
    Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
  }

  serializeErrors() {
    return [this.error];
  }
}

export { MethodNotAllowedError };

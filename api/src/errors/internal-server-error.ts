import { BaseError, SerializedError } from "./base-error";
import { HttpResponseCode } from "../interfaces";

class InternalServerError extends BaseError {
  statusCode = HttpResponseCode.INTERNAL_SERVER_ERROR;
  error: SerializedError = {
    object: "error-detail",
    title: "Internal server error",
    detail: "An unknown error occurred.",
  };

  constructor() {
    super("An unknown error occurred.");
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors() {
    return [this.error];
  }
}

export { InternalServerError };

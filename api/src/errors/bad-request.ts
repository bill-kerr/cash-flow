import { BaseError, SerializedError } from "./base-error";
import { HttpResponseCode } from "../interfaces";

class BadRequestError extends BaseError {
  statusCode = HttpResponseCode.BAD_REQUEST;
  error: SerializedError = {
    object: "error-detail",
    title: "Bad request",
    detail: "",
  };

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
    this.error.detail = message;
  }

  serializeErrors() {
    return [this.error];
  }
}

export { BadRequestError };

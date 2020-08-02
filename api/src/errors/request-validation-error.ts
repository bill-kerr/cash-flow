import { BaseError, SerializedError } from "./base-error";
import { HttpResponseCode } from "../interfaces";
import { ValidationError } from "express-validator";

class RequestValidationError extends BaseError {
  statusCode = HttpResponseCode.BAD_REQUEST;

  constructor(private errors: ValidationError[]) {
    super("Request validation error");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return {
        object: "error-detail",
        title: "Request validation error",
        detail: error.msg,
      } as SerializedError;
    });
  }
}

export { RequestValidationError };

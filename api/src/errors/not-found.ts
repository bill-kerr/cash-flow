import { BaseError, SerializedError } from "./base-error";
import { HttpResponseCode } from "../interfaces";

class NotFoundError extends BaseError {
  statusCode = HttpResponseCode.NOT_FOUND;
  error: SerializedError = {
    object: "error-detail",
    title: "Not found",
    detail: "",
  };

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.error.detail = message;
  }

  serializeErrors() {
    return [this.error];
  }
}

export { NotFoundError };

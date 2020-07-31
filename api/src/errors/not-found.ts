import { BaseError, SerializedError } from "./base-error";
import { HttpResponse } from "../types";

class NotFoundError extends BaseError {
  statusCode = HttpResponse.NOT_FOUND;
  error: SerializedError = {
    object: "error-detail",
    title: "Not found",
    detail: "",
  };

  constructor(message = "The requested resource was not found.") {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.error.detail = message;
  }

  serializeErrors() {
    return [this.error];
  }
}

export { NotFoundError };

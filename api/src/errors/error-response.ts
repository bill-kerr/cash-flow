import { HttpResponse } from "../types";
import { SerializedError } from "./base-error";

interface ErrorResponse {
  object: "list";
  statusCode: HttpResponse;
  errors: SerializedError[];
}

export { ErrorResponse };

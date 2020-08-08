import { HttpResponse } from "../types";
import { SerializedError } from "./base-error";

interface ErrorResponse {
  object: "error";
  statusCode: HttpResponse;
  requestUrl: string;
  errors: SerializedError[];
}

export { ErrorResponse };

import { HttpResponseCode } from "../interfaces";
import { SerializedError } from "./base-error";

interface ErrorResponse {
  object: "list";
  statusCode: HttpResponseCode;
  errors: SerializedError[];
}

export { ErrorResponse };

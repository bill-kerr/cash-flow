import { generate } from "short-uuid";

export function id(): string {
  return generate();
}

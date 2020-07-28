import { merge as _merge } from "lodash";

export function merge<T>(object: T, source: {}): T {
  return _merge(object, source);
}

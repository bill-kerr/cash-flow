import roundTo from "round-to";

export function round(value: string, precision = 2): number {
  return roundTo(parseFloat(value), precision);
}

import { Request } from "express";
import { HttpRequest } from "../interfaces";

export function createHttpRequest(req: Request): HttpRequest {
  const querystring = req.url.split("?")[1];
  const query = new URLSearchParams(querystring);
  return {
    query,
    url: req.baseUrl,
    body: req.body,
    userId: req.userId,
  };
}

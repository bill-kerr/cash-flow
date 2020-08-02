import { Request, Response } from "express";

export enum RequestMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

export enum HttpResponse {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  UNSUPPORTED_MEDIA_TYPE = 415,
  INTERNAL_SERVER_ERROR = 500,
}

export interface HttpRequest {
  query: URLSearchParams;
  url: string;
  body: any;
  userId: string;
}

export interface ListResponse<T> {
  object: "list";
  data: T[];
}

export const httpWrapper = (handler: (req: HttpRequest) => Promise<any>) => {
  return async (req: Request, res: Response) => {
    const querystring = req.url.split("?")[1];
    const query = new URLSearchParams(querystring);
    const request: HttpRequest = {
      query,
      url: req.baseUrl,
      body: req.body,
      userId: req.userId,
    };
    // const params = req.params;
    // const body = req.body;
    // const url = req.baseUrl;
    // const route = req.route;
    // console.log(params, query, body, url, route, querystring);
    const result = await handler(request);
    res.send(result);
  };
};

export interface RouteConfig {
  path: string;
  method: RequestMethod;
  handler: (req: HttpRequest) => Promise<any>;
}

import { Request, Response } from "express";

export interface HttpRequest {
  query: URLSearchParams;
  url: string;
  body: any;
  userId: string;
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
    const params = req.params;
    const body = req.body;
    const url = req.baseUrl;
    const route = req.route;
    console.log(params, query, body, url, route, querystring);
    const result = await handler(request);
    res.send(result);
  };
};

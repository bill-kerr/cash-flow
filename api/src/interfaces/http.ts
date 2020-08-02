export enum RequestMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

export enum HttpResponseCode {
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
  method: string;
}

export interface HttpResponse<T> {
  status: number;
  data: T;
}

import { RequestMethod } from "../interfaces";
import { createHttpRequest } from "../util/http";
import { Request, Response } from "express";

export const Get = (path: string) => (target: Object, _propertyKey: string, descriptor: PropertyDescriptor) => {
  const method = descriptor.value;
  descriptor.value = async function (req: Request, res: Response) {
    const request = createHttpRequest(req);
    const response = await method.apply(null, [request]);
    res.send(response);
  };
  Reflect.defineMetadata(path, { path, method: RequestMethod.GET, handler: descriptor.value }, target);
  return descriptor;
};

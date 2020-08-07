import { Schedule, Exception } from "../entities";

declare module "express-serve-static-core" {
  export interface Request {
    userId: string;
  }

  export interface Response {
    sendRes: (body: any, status?: number) => void;
  }
}

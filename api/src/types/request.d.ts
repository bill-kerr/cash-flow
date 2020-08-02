import { Schedule, Exception } from "../entities";

declare module "express-serve-static-core" {
  export interface Request {
    userId: string;
    schedule: Schedule | undefined;
    exception: Exception | undefined;
  }
}

export { errorHandler } from "./error-handler";
export { requestMethodChecker } from "./request-method-checker";
export { requireAuth } from "./require-auth";
export { handleValidationResult } from "./validation-handler";
export { verifyJsonMediaType } from "./verify-json-media-type";

// export interface Middleware {}

// type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;
// type ExpressErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => void;

// function middlewareWrapper(fn: Middleware): ExpressMiddleware | ExpressErrorHandler {
//   return function(req: Request, res: Response, ) {

//   }
// }

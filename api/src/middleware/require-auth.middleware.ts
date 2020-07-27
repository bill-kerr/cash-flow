import { Request, Response, NextFunction } from "express";
import { authService } from "../services";
import { NotAuthorizedError } from "../errors";

async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    throw new NotAuthorizedError();
  }

  const authHeader = req.headers.authorization.split(" ");
  const bearer = authHeader[0];

  if (bearer !== "Bearer") {
    throw new NotAuthorizedError(
      "The Authorization header must be formatted as 'Bearer <token>' where <token> is a valid auth key."
    );
  }

  const authToken = authHeader[1];
  let user;
  try {
    user = await authService.getUserFromToken(authToken);
  } catch (err) {
    throw new NotAuthorizedError(err.errorInfo.message);
  }

  if (!user) {
    throw new NotAuthorizedError();
  }

  req.currentUserId = user.uid;
  next();
}

export { requireAuth };

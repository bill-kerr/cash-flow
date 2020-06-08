import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

const requireOwnership = (model: any, paramKey: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const paramValue = req.params[paramKey];
    const resource = model.findOne({ userId: req.currentUserId, [paramKey]: paramValue });
    
    if (!resource) {
      throw new NotAuthorizedError();
    }

    next();
  }
};

export { requireOwnership };
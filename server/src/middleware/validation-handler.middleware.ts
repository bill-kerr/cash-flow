import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData, ValidationError, Result } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

export const handleValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = getValidationResult(req);

  if (errors.length > 0) {
    throw new RequestValidationError(errors);
  }

  next();
}

function getValidationResult(req: Request): ValidationError[] {
  const validationErrors = validationResult(req).array();
  const unknownFieldErrors = checkForUnknownFields(req);

  return [...validationErrors, ...unknownFieldErrors];
}

function checkForUnknownFields(req: Request): ValidationError[] {
  const validKeys = Object.keys(matchedData(req, { onlyValidData: false }));
  const requestFields = Object.entries(req.body);
  const unknownFields = requestFields.filter(field => !validKeys.includes(field[0]));
  return generateUnknownFieldErrors(unknownFields);
}

function generateUnknownFieldErrors(fields: [string, any][]): ValidationError[] {
  return fields.map(field => {
    return {
      location: 'body',
      param: field[0],
      value: field[1],
      msg: `Unknown property ${ field[0] } with value ${ field[1] }.`
    }
  });
}
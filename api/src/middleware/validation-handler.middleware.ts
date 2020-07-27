import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData, ValidationError } from "express-validator";
import { RequestValidationError } from "../errors";

export const handleValidationResult = (req: Request, res: Response, next: NextFunction) => {
  const errors = getValidationResult(req);

  if (errors.length > 0) {
    throw new RequestValidationError(errors);
  }

  next();
};

function getValidationResult(req: Request): ValidationError[] {
  const validationErrors = validationResult(req).array();
  const unknownFieldErrors = generateUnknownFieldErrors(req);

  return [...validationErrors, ...unknownFieldErrors];
}

function generateUnknownFieldErrors(req: Request): ValidationError[] {
  const unknownFields = getUnknownFields(req);
  return unknownFields.map((field) => {
    return {
      location: "body",
      param: field[0],
      value: field[1],
      msg: `Unknown property '${field[0]}' with value '${field[1]}'.`,
    };
  });
}

function getUnknownFields(req: Request): [string, any][] {
  const validKeys = Object.keys(matchedData(req, { onlyValidData: false }));
  const requestFields = [...Object.entries(req.body), ...Object.entries(req.query)];
  const unknownFields = requestFields.filter((field) => !validKeys.includes(field[0]));
  return unknownFields;
}

import { query } from "express-validator";
import { isValidDate } from "./custom-validators";

export const queryDateRangeValidator = [
  query("startDate")
    .notEmpty()
    .bail()
    .withMessage("The startDate query parameter is required and cannot be empty.")
    .trim()
    .escape()
    .custom(isValidDate)
    .withMessage("The startDate query parameter must contain a valid date formatted as YYYY-MM-DD."),
  query("endDate")
    .notEmpty()
    .bail()
    .withMessage("The endDate query parameter is required and cannot be empty.")
    .trim()
    .escape()
    .custom(isValidDate)
    .withMessage("The endDate query parameter must contain a valid date formatted as YYYY-MM-DD."),
];

export const optionalQueryDateRangeValidator = [
  query("startDate")
    .optional()
    .notEmpty()
    .bail()
    .withMessage("The startDate query parameter is required and cannot be empty.")
    .trim()
    .escape()
    .custom(isValidDate)
    .withMessage("The startDate query parameter must contain a valid date formatted as YYYY-MM-DD."),
  query("endDate")
    .optional()
    .notEmpty()
    .bail()
    .withMessage("The endDate query parameter is required and cannot be empty.")
    .trim()
    .escape()
    .custom(isValidDate)
    .withMessage("The endDate query parameter must contain a valid date formatted as YYYY-MM-DD."),
];

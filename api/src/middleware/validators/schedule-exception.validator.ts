import { isValidDate } from '../validators/custom-validators';
import { body } from 'express-validator';

export const createScheduleExceptionByScheduleValidator = [
  body('date')
    .notEmpty()
    .bail()
    .withMessage('The date field is required and cannot be empty.')
    .trim()
    .escape()
    .custom(isValidDate)
    .withMessage('The date field must contain a valid date formatted as YYYY-MM-DD.'),
  body('deleted')
    .notEmpty()
    .bail()
    .withMessage('The deleted field is required and cannot be empty.')
    .trim()
    .escape()
    .customSanitizer(val => val.toLowerCase())
    .isBoolean()
    .withMessage('The deleted field must contain a boolean.')
    .customSanitizer(val => val === 'true'),
  body('amount')
    .notEmpty()
    .bail()
    .withMessage('The amount field is required and cannot be empty.')
    .trim()
    .escape()
    .isFloat()
    .withMessage('The amount field must contain a number.')
    .customSanitizer(val => parseFloat(val).toFixed(2)),
  body('description')
    .notEmpty()
    .bail()
    .withMessage('The description field is required and cannot be empty.')
    .trim()
    .escape()
    .isString()
    .withMessage('The description field must contain a string.')
];

export const createScheduleExceptionValidator = [
  ...createScheduleExceptionByScheduleValidator,
  body('schedule')
    .notEmpty()
    .bail()
    .withMessage('The schedule field is required and cannot be empty.')
    .trim()
    .escape()
    .isString()
    .withMessage('The schedule field must contain a string.')
];
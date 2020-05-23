import { body } from 'express-validator';

import { dateRegex } from '../../util/date-regex';

const createTransactionScheduleValidator = [
  body('amount')
    .notEmpty()
    .bail()
    .withMessage('The amount field is required and cannot be empty.')
    .isFloat()
    .withMessage('The amount field must contain a number.'),
  body('description')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('The description field is required and cannot be empty.')
    .isString()
    .withMessage('The description field must contain a string.'),
  body('isRecurring')
    .notEmpty()
    .bail()
    .withMessage('The isRecurring field is required and cannot be empty.')
    .isBoolean()
    .withMessage('The isRecurring field must contain a boolean.'),
  body('startDate')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('The startDate field is required and cannot be empty.')
    .matches(dateRegex)
    .withMessage('The endDate field must contain a date formatted as YYYY-MM-DD.'),
  body('endDate')
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .withMessage('The endDate field cannot be empty.')
    .matches(dateRegex)
    .withMessage('The endDate field must contain a date formatted as YYYY-MM-DD.')
];

export { createTransactionScheduleValidator };
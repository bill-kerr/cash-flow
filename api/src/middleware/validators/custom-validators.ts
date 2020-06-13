import moment from 'moment';
import { body, ValidationChain } from 'express-validator';
import { DayOfWeek, Frequency, Month } from '../../types';
import { keyExists } from '../../util';

export const isValidDate = (dateString: string): boolean => {
  return moment(dateString, 'YYYY-MM-DD', true).isValid();
};

export const isDayOfWeek = (value: string): boolean => {
  return Object.values(DayOfWeek).includes(value as DayOfWeek);
};

export const isFrequency = (value: string): boolean => {
  return Object.values(Frequency).includes(value as Frequency);
};

export const isMonth = (value: string): boolean => {
  return Object.values(Month).includes(value as Month);
};

export const checkIsRecurring = (fieldName: string): ValidationChain => {
  return body(fieldName)
    .custom((_: any, { req, path }: any) => !(req.body.isRecurring === false && keyExists(req.body, path)))
    .withMessage(`The ${ fieldName } field should not exist if isRecurring is set to false.`);
};

export const recurringIsTrue = body('isRecurring').equals('true');
export const requiredMessage = (fieldName: string) => `The ${ fieldName } field is required and should not be empty.`;

export const stringField = (fieldName: string) => body(fieldName)
  .notEmpty()
  .bail()
  .withMessage(requiredMessage(fieldName))
  .trim()
  .escape()
  .isString()
  .withMessage(`The ${ fieldName } field must contain a string.`);

export const floatField = (fieldName: string) => body(fieldName)
  .notEmpty()
  .bail()
  .withMessage(requiredMessage(fieldName))
  .trim()
  .escape()
  .isFloat()
  .withMessage(`The ${ fieldName } field must contain a number.`)
  .customSanitizer(val => parseFloat(val).toFixed(2));

export const booleanField = (fieldName: string) => body(fieldName)
  .notEmpty()
  .bail()
  .withMessage(requiredMessage(fieldName))
  .trim()
  .escape()
  .customSanitizer(val => val.toLowerCase())
  .isBoolean()
  .withMessage(`The ${ fieldName } field must contain a boolean.`)
  .customSanitizer(val => val === 'true');

export const dateField = (
  fieldName: string, 
  runCondition = body(fieldName).exists()
) => body(fieldName)
  .if(runCondition)
  .notEmpty()
  .bail()
  .withMessage(requiredMessage(fieldName))
  .trim()
  .escape()
  .custom(isValidDate)
  .withMessage(`The ${ fieldName } field must contain a valid date formatted as YYYY-MM-DD.`);

export const frequencyField = (
  fieldName: string,
  runCondition = body(fieldName).exists()
) => body(fieldName)
  .if(runCondition)
  .notEmpty()
  .bail()
  .withMessage(requiredMessage(fieldName))
  .trim()
  .escape()
  .custom(isFrequency)
  .withMessage(`The ${ fieldName } field must contain one of \'DAILY\', \'WEEKLY\', \'MONTHLY\', or \'YEARLY\'.`);

export const customField = (
  fieldName: string,
  customValidator: (value: string) => boolean,
  customMessage: string,
  runCondition = body(fieldName).exists()
) => body(fieldName)
  .if(runCondition)
  .notEmpty()
  .bail()
  .withMessage(requiredMessage(fieldName))
  .trim()
  .escape()
  .custom(customValidator)
  .withMessage(customMessage);

export const positiveIntegerField = (
  fieldName: string, 
  runCondition = body(fieldName).exists()
) => body(fieldName)
  .if(runCondition)
  .notEmpty()
  .bail()
  .withMessage(requiredMessage(fieldName))
  .trim()
  .escape()
  .isInt({ min: 1 })
  .withMessage(`The ${ fieldName } field must contain an integer not less than one.`)
  .customSanitizer(val => parseInt(val));

export const dayOfWeekField = (
  fieldName: string,
  runCondition = body(fieldName).exists()
) => body(fieldName)
  .if(runCondition)
  .custom((_, { req }) => !(req.body.frequency !== Frequency.WEEKLY && keyExists(req.body, fieldName)))
  .bail()
  .withMessage(`The ${ fieldName } field should not exist if frequency is not set to \'WEEKLY\'.`)
  .if(body('frequency').equals(Frequency.WEEKLY))
  .notEmpty()
  .bail()
  .withMessage(`The ${ fieldName } field should not be empty if frequency is set to \'WEEKLY\'.`)
  .trim()
  .escape()
  .custom(isDayOfWeek)
  .withMessage(`The ${ fieldName } field must contain one of \'SUNDAY\', \'MONDAY\', \'TUESDAY\', \'WEDNESDAY\', \'THURSDAY\', \'FRIDAY\', OR \'SATURDAY\'.`);

export const dayOfMonthField = (
  fieldName: string,
  runCondition = body(fieldName).exists()
) => body(fieldName)
  .if(runCondition)
  .custom((_, { req }) => 
    !((req.body.frequency !== Frequency.MONTHLY && req.body.frequency !== Frequency.YEARLY) 
    && keyExists(req.body, fieldName))
  )
  .bail()
  .withMessage(`The ${ fieldName } field should not exist if frequency is not set to \'MONTHLY\' or \'YEARLY\'.`)
  .if(body('frequency').custom(val => val === Frequency.MONTHLY || val === Frequency.YEARLY))
  .notEmpty()
  .bail()
  .withMessage(`The ${ fieldName } field should not be empty if frequency is set to \'MONTHLY\' or \'YEARLY\'.`)
  .trim()
  .escape()
  .isInt({ min: 1, max: 31 })
  .withMessage(`The ${ fieldName } field must contain an integer between 1 and 31.`);

export const monthField = (
  fieldName: string,
  runCondition = body(fieldName).exists()
) => body(fieldName)
  .if(runCondition)
  .custom((_, { req }) => !(req.body.isRecurring === 'false' && keyExists(req.body, fieldName)))
    .bail()
    .withMessage(`The ${ fieldName } field should not exist if isRecurring is set to false.`)
    .custom((_, { req }) => !(req.body.frequency !== Frequency.YEARLY && keyExists(req.body, fieldName)))
    .bail()
    .withMessage(`The ${ fieldName } field should not exist if frequency is not set to \'YEARLY\'.`)
    .if(body('frequency').equals(Frequency.YEARLY))
    .notEmpty()
    .bail()
    .withMessage(`The ${ fieldName } field should not be empty if frequency is set to \'YEARLY\'.`)
    .trim()
    .escape()
    .custom(isMonth)
    .withMessage(`The ${ fieldName } field must contain one of \'JANUARY\', \'FEBRUARY\', \'MARCH\', \'APRIL\', \'MAY\', \'JUNE\', \'JULY\', \'AUGUST\', \'SEPTEMBER\', \'OCTOBER\', \'NOVEMBER\', OR \'DECEMBER\'.`);
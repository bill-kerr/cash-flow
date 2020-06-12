import { isDayOfWeek, isMonth, floatField, stringField, booleanField, dateField, checkIsRecurring, recurringIsTrue, positiveIntegerField, frequencyField, dayOfWeekField } from './custom-validators';
import { keyExists } from '../../util';
import { Frequency } from '../../types';
import { body } from 'express-validator';

export const createScheduleValidator = [
  floatField('amount'),
  stringField('description'),
  booleanField('isRecurring'),
  dateField('startDate'),
  checkIsRecurring('endDate'),
  dateField('endDate', recurringIsTrue).optional(),
  checkIsRecurring('frequency'),
  frequencyField('frequency', recurringIsTrue),
  checkIsRecurring('interval'),
  positiveIntegerField('interval', recurringIsTrue),
  checkIsRecurring('dayOfWeek'),
  dayOfWeekField('dayOfWeek', recurringIsTrue),
  body('dayOfMonth')
    .custom((_, { req }) => !(req.body.isRecurring === 'false' && keyExists(req.body, 'dayOfMonth')))
    .bail()
    .withMessage('The dayOfMonth field should not exist if isRecurring is set to false.')
    .custom((_, { req }) => !((req.body.frequency !== Frequency.MONTHLY && req.body.frequency !== Frequency.YEARLY) && keyExists(req.body, 'dayOfMonth')))
    .bail()
    .withMessage('The dayOfMonth field should not exist if frequency is not set to \'MONTHLY\' or \'YEARLY\'.')
    .if(body('frequency').custom(val => val === Frequency.MONTHLY || val === Frequency.YEARLY))
    .notEmpty()
    .bail()
    .withMessage('The dayOfMonth field should not be empty if frequency is set to \'MONTHLY\' or \'YEARLY\'.')
    .trim()
    .escape()
    .isInt({ min: 1, max: 31 })
    .withMessage('The dayOfMonth field must contain an integer between 1 and 31.'),
  body('month')
    .custom((_, { req }) => !(req.body.isRecurring === 'false' && keyExists(req.body, 'month')))
    .bail()
    .withMessage('The month field should not exist if isRecurring is set to false.')
    .custom((_, { req }) => !(req.body.frequency !== Frequency.YEARLY && keyExists(req.body, 'month')))
    .bail()
    .withMessage('The month field should not exist if frequency is not set to \'YEARLY\'.')
    .if(body('frequency').equals(Frequency.YEARLY))
    .notEmpty()
    .bail()
    .withMessage('The month field should not be empty if frequency is set to \'YEARLY\'.')
    .trim()
    .escape()
    .custom(isMonth)
    .withMessage('The month field must contain one of \'JANUARY\', \'FEBRUARY\', \'MARCH\', \'APRIL\', \'MAY\', \'JUNE\', \'JULY\', \'AUGUST\', \'SEPTEMBER\', \'OCTOBER\', \'NOVEMBER\', OR \'DECEMBER\'.')
];

export const editScheduleValidator = [
  stringField('description')
];
import { floatField, stringField,booleanField, dateField } from './custom-validators';

export const createScheduleExceptionByScheduleValidator = [
  dateField('date'),
  dateField('currentDate').optional(),
  booleanField('occurrenceDeleted').optional(),
  floatField('amount').optional(),
  stringField('description').optional()
];

export const createScheduleExceptionValidator = [
  ...createScheduleExceptionByScheduleValidator,
  stringField('schedule')
];

export const editScheduleExceptionValidator = [
  dateField('date').optional(),
  dateField('currentDate').optional(),
  booleanField('occurrenceDeleted').optional(),
  floatField('amount').optional(),
  stringField('description').optional()
];
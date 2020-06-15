import { floatField, stringField,booleanField, dateField } from './custom-validators';

export const createScheduleExceptionByScheduleValidator = [
  dateField('date'),
  booleanField('occurrenceDeleted').optional(),
  floatField('amount').optional(),
  stringField('description').optional()
];

export const createScheduleExceptionValidator = [
  ...createScheduleExceptionByScheduleValidator,
  stringField('schedule')
];
import { 
  floatField, 
  stringField, 
  dateField, 
  positiveIntegerField, 
  frequencyField, 
  dayOfWeekField, 
  dayOfMonthField, 
  monthField 
} from './custom-validators';

export const createScheduleValidator = [
  floatField('amount'),
  stringField('description'),
  dateField('startDate'),
  dateField('endDate').optional(),
  frequencyField('frequency'),
  positiveIntegerField('interval').optional(),
  dayOfWeekField('dayOfWeek'),
  dayOfMonthField('dayOfMonth'),
  monthField('month')
];

export const editScheduleValidator = [
  floatField('amount').optional(),
  stringField('description').optional(),
  dateField('startDate').optional(),
  dateField('endDate').optional(),
  frequencyField('frequency').optional(),
  positiveIntegerField('interval').optional(),
  dayOfWeekField('dayOfWeek'),
  dayOfMonthField('dayOfMonth'),
  monthField('month')
];
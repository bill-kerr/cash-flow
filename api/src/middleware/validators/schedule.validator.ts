import { 
  floatField, 
  stringField, 
  booleanField, 
  dateField, 
  checkIsRecurring, 
  recurringIsTrue, 
  positiveIntegerField, 
  frequencyField, 
  dayOfWeekField, 
  dayOfMonthField, 
  monthField 
} from './custom-validators';

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
  checkIsRecurring('dayOfMonth'),
  dayOfMonthField('dayOfMonth', recurringIsTrue),
  checkIsRecurring('month'),
  monthField('month', recurringIsTrue)
];

export const editScheduleValidator = [
  stringField('description').optional()
];
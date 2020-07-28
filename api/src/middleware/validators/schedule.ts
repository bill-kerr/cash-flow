import {
  floatField,
  stringField,
  dateField,
  nullableDateField,
  positiveIntegerField,
  frequencyField,
  dayOfWeekField,
  dayOfMonthField,
  monthField,
} from "./custom-validators";

export const createScheduleValidator = [
  floatField("amount"),
  stringField("description"),
  dateField("startDate"),
  dateField("endDate").optional(),
  frequencyField("frequency"),
  positiveIntegerField("interval").optional(),
  positiveIntegerField("occurrenceCount").optional(),
  dayOfWeekField("dayOfWeek"),
  dayOfMonthField("dayOfMonth"),
  monthField("month"),
];

export const updateScheduleValidator = [
  floatField("amount").optional(),
  stringField("description").optional(),
  dateField("startDate").optional(),
  nullableDateField("endDate").optional(),
  frequencyField("frequency").optional(),
  positiveIntegerField("interval").optional(),
  positiveIntegerField("occurrenceCount").optional(),
  dayOfWeekField("dayOfWeek"),
  dayOfMonthField("dayOfMonth"),
  monthField("month"),
];
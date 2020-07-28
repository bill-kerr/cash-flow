import { floatField, stringField, booleanField, dateField } from "./custom-validators";

export const createExceptionByScheduleValidator = [
  dateField("date"),
  dateField("currentDate").optional(),
  booleanField("occurrenceDeleted").optional(),
  floatField("amount").optional(),
  stringField("description").optional(),
];

export const createExceptionValidator = [...createExceptionByScheduleValidator, stringField("scheduleId")];

export const updateExceptionValidator = [
  dateField("date").optional(),
  dateField("currentDate").optional(),
  booleanField("occurrenceDeleted").optional(),
  floatField("amount").optional(),
  stringField("description").optional(),
];

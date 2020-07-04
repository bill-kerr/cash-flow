import { Frequency, DayOfWeek, Month } from "../../types";

export interface CreateRecurrenceDto {
  frequency: Frequency;
  startDate: string;
  interval?: number;
  dayOfWeek?: DayOfWeek;
  dayOfMonth?: number;
  month?: Month;
  endDate?: string;
}
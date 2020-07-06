import { Frequency, DayOfWeek, Month } from '..';

export interface CreateRecurrenceDto {
  frequency: Frequency;
  startDate: string;
  interval?: number;
  occurrenceCount?: number;
  dayOfWeek?: DayOfWeek;
  dayOfMonth?: number;
  month?: Month;
  endDate?: string;
}
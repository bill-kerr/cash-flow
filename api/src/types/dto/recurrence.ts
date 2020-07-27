import { Frequency, DayOfWeek, Month } from "..";

export interface CreateRecurrenceDto {
  frequency: Frequency;
  startDate: string;
  interval?: number | null;
  occurrenceCount?: number | null;
  dayOfWeek?: DayOfWeek | null;
  dayOfMonth?: number | null;
  month?: Month | null;
  endDate?: string | null;
}

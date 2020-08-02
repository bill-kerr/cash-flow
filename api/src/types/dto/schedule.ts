import { Frequency, DayOfWeek, Month } from "..";

export interface CreateScheduleDto {
  id?: string;
  amount: number;
  description: string;
  startDate: string;
  endDate?: string;
  frequency: Frequency;
  interval?: number;
  occurrenceCount?: number;
  dayOfWeek?: DayOfWeek;
  dayOfMonth?: number;
  month?: Month;
  recurrenceRule?: string;
  userId: string;
}

export interface UpdateScheduleDto {
  id?: string;
  amount?: number;
  description?: string;
  startDate?: string;
  endDate?: string | null;
  frequency?: Frequency;
  interval?: number;
  occurrenceCount?: number | null;
  dayOfWeek?: DayOfWeek | null;
  dayOfMonth?: number | null;
  month?: Month | null;
  recurrenceRule?: string;
  userId: string;
}

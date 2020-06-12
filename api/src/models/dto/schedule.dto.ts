import { Frequency, DayOfWeek, Month } from '../../types';

export interface CreateScheduleDto {
  id: string;
  amount: number;
  description: string;
  isRecurring: boolean;
  startDate: string;
  endDate?: string;
  frequency?: Frequency;
  interval?: number;
  dayOfWeek?: DayOfWeek;
  dayOfMonth?: number;
  month?: Month;
  recurrenceRule?: string;
  userId: string;
}

export interface EditScheduleDto {
  id: string;
  amount?: number;
  description?: string;
  isRecurring?: boolean;
  startDate?: string;
  endDate?: string;
  frequency?: Frequency;
  interval?: number;
  dayOfWeek?: DayOfWeek;
  dayOfMonth?: number;
  month?: Month;
  recurrenceRule?: string;
}
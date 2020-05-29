import { Frequency, DayOfWeek, Month } from '../../types';

interface CreateScheduleDto {
  id: string;
  amount: number;
  description: string;
  recurring: boolean;
  startDate: string;
  endDate?: string;
  frequency?: Frequency;
  interval?: number;
  dayOfWeek?: DayOfWeek;
  dayOfMonth?: number;
  month?: Month
  userId: string;
}

export { CreateScheduleDto };
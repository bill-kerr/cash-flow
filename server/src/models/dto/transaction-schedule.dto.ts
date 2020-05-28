import { Frequency, DayOfWeek, Month } from '../../types';

interface CreateTransactionScheduleDto {
  id: string;
  amount: number;
  description: string;
  recurring: boolean;
  startDate: string;
  endDate?: string;
  frequency?: Frequency;
  separation?: number;
  dayOfWeek?: DayOfWeek;
  dayOfMonth?: number;
  month?: Month
  userId: string;
}

export { CreateTransactionScheduleDto };
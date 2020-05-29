import { Moment } from 'moment';

export interface CreateScheduleExceptionDto {
  date: Moment;
  amount: number;
  description: string;
  schedule: string;
}
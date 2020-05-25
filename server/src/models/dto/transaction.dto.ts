import { Moment } from 'moment';

export interface CreateTransactionDto {
  date: Moment;
  amount: number;
  description: string;
  transactionSchedule: string;
}
import { Moment } from 'moment';

export interface Occurrence {
  date: Moment;
  amount: number;
  description: string;
  schedule: string;
}
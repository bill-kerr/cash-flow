import { Frequency } from '../../types/frequency';
import { DayOfWeek } from '../../types/dayOfWeek';
import { Month } from '../../types/month';

export interface Schedule {
  object: 'schedule';
  id: string;
  amount: number;
  description: string;
  startDate: string;
  endDate: string | null;
  frequency: Frequency;
  interval: number;
  occurrenceCount: number | null;
  dayOfWeek: DayOfWeek | null;
  dayOfMonth: number | null;
  month: Month | null;
  recurrenceRule: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface ScheduleState {
  schedules: { [key: string]: Schedule };
}

export const FETCH_SCHEDULES_START = 'Schedules:FetchStart';
export const FETCH_SCHEDULES_COMPLETE = 'Schedules:FetchComplete';

export interface IFetchSchedulesCompleteAction {
  type: typeof FETCH_SCHEDULES_COMPLETE;
  schedules: Schedule[];
}

export interface IFetchSchedulesStartAction {
  type: typeof FETCH_SCHEDULES_START;
}

export type ScheduleActionTypes = IFetchSchedulesStartAction | IFetchSchedulesCompleteAction;

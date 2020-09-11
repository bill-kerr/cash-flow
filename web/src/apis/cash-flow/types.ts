import { Schedule } from '../../store/schedules/types';
import { Occurrence } from '../../store/occurrences/types';

export interface ErrorResponse {
  object: 'error';
  statusCode: number;
  requestUrl: string;
  errors: ErrorDetail[];
}

export interface ErrorDetail {
  object: 'error-detail';
  title: string;
  detail: string;
}

export interface ScheduleListResponse {
  object: 'list';
  data: Schedule[];
}

export interface OccurrenceListResponse {
  object: 'list';
  data: Occurrence[];
}

export type CashFlowResponse = ErrorResponse | ScheduleListResponse | OccurrenceListResponse;

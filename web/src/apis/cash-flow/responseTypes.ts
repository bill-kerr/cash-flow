import { Schedule } from '../../store/schedules/types';

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

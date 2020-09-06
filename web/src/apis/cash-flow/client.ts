import axios from 'axios';
import { Schedule } from '../../store/schedules/types';
import { ScheduleListResponse, ErrorResponse, ErrorDetail } from './responseTypes';

export const cashFlowClient = axios.create({
  baseURL: 'http://localhost:3333/api',
});

export interface CashFlowHeaders {
  Authorization: string;
  'Content-Type': 'application/json';
}

export const getHeaders = (authToken: string): CashFlowHeaders => {
  return {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };
};

export const getSchedules = async (authToken: string): Promise<Schedule[] | ErrorDetail[]> => {
  const res = await cashFlowClient.get<ScheduleListResponse | ErrorResponse>('/schedules', {
    headers: getHeaders(authToken),
  });

  return res.data.object === 'list' ? res.data.data : res.data.errors;
};

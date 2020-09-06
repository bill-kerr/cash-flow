import axios from 'axios';
import { ScheduleListResponse, ErrorResponse, ErrorDetail } from './responseTypes';
import { Schedule } from '../../store/schedules/types';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3333/api/v1',
});

export interface CashFlowHeaders {
  Authorization: string;
  'Content-Type': 'application/json';
}

export const cashFlowClient = {
  getHeaders: function (authToken: string): CashFlowHeaders {
    return {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };
  },

  getSchedules: async function (authToken: string): Promise<[Schedule[], ErrorDetail[]]> {
    const res = await axiosClient.get<ScheduleListResponse | ErrorResponse>('/schedules', {
      headers: this.getHeaders(authToken),
    });

    return res.data.object === 'error' ? [[], res.data.errors] : [res.data.data, []];
  },
};

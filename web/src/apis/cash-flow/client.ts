import axios from 'axios';
import { ScheduleListResponse, ErrorResponse, OccurrenceListResponse } from './types';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3333/api/v1',
});

export interface CashFlowHeaders {
  Authorization: string;
  'Content-Type': 'application/json';
}

export interface ICashFlowClient {
  getHeaders: (authToken: string) => CashFlowHeaders;
  getSchedules: (authToken: string) => Promise<ScheduleListResponse | ErrorResponse>;
  getOccurrences: (
    authToken: string,
    startDate: string,
    endDate: string
  ) => Promise<OccurrenceListResponse | ErrorResponse>;
}

export const cashFlowClient: ICashFlowClient = {
  getHeaders: function (authToken) {
    return {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };
  },

  getSchedules: async function (authToken) {
    const { data } = await axiosClient.get<ScheduleListResponse | ErrorResponse>('/schedules', {
      headers: this.getHeaders(authToken),
    });
    return data;
  },

  getOccurrences: async function (authToken, startDate, endDate) {
    const { data } = await axiosClient.get<OccurrenceListResponse | ErrorResponse>('/occurrences', {
      params: { startDate, endDate },
      headers: this.getHeaders(authToken),
    });
    return data;
  },
};

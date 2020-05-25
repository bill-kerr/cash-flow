import moment from 'moment';
import { DayOfWeek, Frequency, Month } from '../types';

export const isValidDate = (dateString: string): boolean => {
  return moment(dateString, 'YYYY-MM-DD', true).isValid();
};

export const isDayOfWeek = (value: string): boolean => {
  return Object.values(DayOfWeek).includes(value as DayOfWeek);
};

export const isFrequency = (value: string): boolean => {
  return Object.values(Frequency).includes(value as Frequency);
};

export const isMonth = (value: string): boolean => {
  return Object.values(Month).includes(value as Month);
};
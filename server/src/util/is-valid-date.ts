import moment from 'moment';

export const isValidDate = (dateString: string): boolean => {
  return moment(dateString, 'YYYY-MM-DD', true).isValid();
};
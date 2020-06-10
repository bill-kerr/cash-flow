import moment from 'moment';

export function getUTCDateFromString(dateString: string): Date {
  const dateValues = dateString.split('-');

  const year = parseInt(dateValues[0]);
  const month = parseInt(dateValues[1]);
  const day = parseInt(dateValues[2]);
  return new Date(Date.UTC(year, month - 1, day));
}

export function parseUTCDateList(dates: Date[]): string[] {
  return dates.map((date: Date) => {
    return moment(date).utc().format('YYYY-MM-DD');
  });
}
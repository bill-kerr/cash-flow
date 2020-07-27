import moment from "moment";

export function getUTCDateFromString(dateString: string): Date {
  const dateValues = dateString.split("-");
  const year = parseInt(dateValues[0]);
  const month = parseInt(dateValues[1]);
  const day = parseInt(dateValues[2]);
  return new Date(Date.UTC(year, month - 1, day));
}

export function parseUTCDateList(dates: Date[]): string[] {
  return dates.map((date: Date) => {
    return moment(date).utc().format("YYYY-MM-DD");
  });
}

export function buildDateFilter(startDate?: string, endDate?: string): { date: { $gte?: string; $lte?: string } } {
  const filter: any = {};

  if (startDate) {
    filter.$gte = startDate;
  }
  if (endDate) {
    filter.$lte = endDate;
  }

  return { date: filter };
}

export function getUnixTime() {
  return Math.round(moment().unix() / 1000);
}

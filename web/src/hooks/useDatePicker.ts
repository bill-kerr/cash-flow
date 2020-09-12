import { useState } from 'react';
import moment from 'moment';

type PickerInputDate = Exclude<moment.MomentInput, null | undefined>;
type PickerDate = moment.Moment;

interface DatePickerConfig {
  initialDate?: PickerInputDate;
  initialRange?: { startDate: PickerInputDate; endDate: PickerInputDate };
  monthStrings?: MonthStrings;
  yearDigits?: 2 | 4;
}

interface DateRange {
  startDate: PickerDate;
  endDate: PickerDate;
}

interface MonthStrings {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
}

const defaultMonthStrings: MonthStrings = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

export const useDatePicker = ({
  monthStrings = defaultMonthStrings,
  yearDigits = 4,
  initialDate = new Date(),
  initialRange = getDateRange(moment()),
}: DatePickerConfig) => {
  const [currentDate, setCurrentDate] = useState(moment(initialDate));
  const [currentRange, setCurrentRange] = useState(makeDateRange(initialRange));
};

const makeDateRange = (range: { startDate: PickerInputDate; endDate: PickerInputDate }): DateRange => {
  return { startDate: moment(range.startDate), endDate: moment(range.endDate) };
};

const getDateRange = (date: PickerDate): DateRange => {
  return {
    startDate: date.startOf('month'),
    endDate: date.endOf('month'),
  };
};

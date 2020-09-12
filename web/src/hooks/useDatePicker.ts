import { useState } from 'react';
import moment from 'moment';

type PickerInputDate = Exclude<moment.MomentInput, null | undefined>;
type PickerInputRange = { startDate: PickerInputDate; endDate: PickerInputDate };
type PickerDate = moment.Moment;

interface DatePickerConfig {
  name: string;
  initialDate?: PickerInputDate;
  initialRange?: PickerInputRange;
  monthStrings?: MonthStrings;
  yearDigits?: 2 | 4;
}

interface DatePickerBag {
  field: React.InputHTMLAttributes<HTMLInputElement>;
  setDate: (date: PickerInputDate) => void;
  setRange: (range: PickerInputRange) => void;
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
  name,
  monthStrings = defaultMonthStrings,
  yearDigits = 4,
  initialDate = new Date(),
  initialRange = getDateRange(moment()),
}: DatePickerConfig): DatePickerBag => {
  const [currentDate, setCurrentDate] = useState(moment(initialDate));
  const [currentRange, setCurrentRange] = useState(makeDateRange(initialRange));

  return {
    field: { type: 'text', readOnly: true, value: currentDate.toString() },
    setDate: (date: PickerInputDate) => {
      setCurrentDate(moment(date));
    },
    setRange: (range: PickerInputRange) => {
      setCurrentRange(makeDateRange(range));
    },
  };
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

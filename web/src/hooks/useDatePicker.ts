import { useEffect, useState } from 'react';
import { toDate, format, startOfMonth, endOfMonth, eachDayOfInterval, getDate, getDay, sub, add } from 'date-fns';

type DateFormat = 'yyyy-MM-dd' | 'yy-MM-dd' | 'MM/dd/yyyy' | 'MM/dd/yy';

interface DatePickerConfig {
  name: string;
  initialDate?: Date | number;
  initialRange?: DateRange;
  monthStrings?: MonthStrings;
  yearDigits?: 2 | 4;
  displayFormat?: DateFormat;
  dateFormat?: 'normal' | 'padded';
  rangeOverflow?: 'dates' | 'blanks';
}

interface DatePickerBag {
  field: React.InputHTMLAttributes<HTMLInputElement>;
  dates: DateItem[];
  rangeStartDay: number;
  rangeEndDay: number;
  rangeStartBlanks: number;
  rangeEndBlanks: number;
  nextRange: () => void;
  prevRange: () => void;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateItem {
  label: string;
  key: number;
  onClick: () => void;
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

// const defaultMonthStrings: MonthStrings = {
//   0: 'January',
//   1: 'February',
//   2: 'March',
//   3: 'April',
//   4: 'May',
//   5: 'June',
//   6: 'July',
//   7: 'August',
//   8: 'September',
//   9: 'October',
//   10: 'November',
//   11: 'December',
// };

export const useDatePicker = ({
  name,
  // monthStrings = defaultMonthStrings,
  // yearDigits = 4,
  displayFormat = 'yyyy-MM-dd',
  initialDate = toDate(new Date()),
  initialRange = { startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()) },
  dateFormat = 'normal',
  rangeOverflow = 'blanks',
}: DatePickerConfig): DatePickerBag => {
  const [currentDate, setCurrentDate] = useState<Date>(toDate(initialDate));
  const [currentRange, setCurrentRange] = useState<DateRange>({
    startDate: toDate(initialRange.startDate),
    endDate: toDate(initialRange.endDate),
  });

  useEffect(() => {
    updateRange(currentDate);
  }, [currentDate]);

  const updateRange = (date: Date) => {
    setCurrentRange({ startDate: startOfMonth(date), endDate: endOfMonth(date) });
  };

  const onDateClicked = (date: Date) => {
    console.log(date);
    setCurrentDate(date);
  };

  const getDatesInRange = (range: DateRange): DateItem[] => {
    if (rangeOverflow === 'dates') {
      const overflow = getRangeOverflow();
      range.startDate = sub(range.startDate, { days: overflow.start });
      range.endDate = add(range.endDate, { days: overflow.end });
    }

    const interval = eachDayOfInterval({ start: range.startDate, end: range.endDate });
    return interval.map((date, i) => {
      const dateText = getDate(date).toString(10);
      const label = dateFormat === 'padded' ? dateText.padStart(2, '0') : dateText;
      return { key: i, label, onClick: () => onDateClicked(date) };
    });
  };

  const getRangeOverflow = () => {
    const startOverflow = getDay(currentRange.startDate);
    const endOverflow = 6 - getDay(currentRange.endDate);
    return { start: startOverflow, end: endOverflow };
  };

  return {
    field: {
      type: 'text',
      readOnly: true,
      value: format(currentDate, displayFormat),
      name,
      onClick: () => console.log(currentRange),
      onChange: () => updateRange(currentDate),
    },
    dates: getDatesInRange(currentRange),
    rangeStartDay: getDay(currentRange.startDate),
    rangeEndDay: getDay(currentRange.endDate),
    rangeStartBlanks: rangeOverflow === 'blanks' ? getRangeOverflow().start : 0,
    rangeEndBlanks: rangeOverflow === 'blanks' ? getRangeOverflow().end : 0,
    nextRange: () => null,
    prevRange: () => null,
  };
};

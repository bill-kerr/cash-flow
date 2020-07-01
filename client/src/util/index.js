

export const getFrequencyDescription = schedule => {
  switch (schedule.frequency) {
    case 'ONCE':
      return `on ${ schedule.startDate }`;
    case 'DAILY':
      return `every ${ schedule.interval } days`;
    case 'WEEKLY':
      return `every ${ schedule.interval } weeks on ${ capitalCase(schedule.dayOfWeek) }`;
    case 'MONTHLY':
      return `every ${ schedule.interval } months on the ${ addMonthDateSuffix(schedule.dayOfMonth) }`;
    case 'YEARLY':
      return `every ${ schedule.interval } years in ${ schedule.month } on the ${ addMonthDateSuffix(schedule.dayOfMonth) }`;
  }
};

export const capitalCase = text => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const addMonthDateSuffix = date => {
  return date.toString() + numberSuffix(date);
};

export const numberSuffix = num => {
  if (num === 11 || num === 12 || num === 13) {
    return 'th';
  }

  num = Math.abs(num % 10);
  if (num === 1) {
    return 'st';
  }
  if (num === 2) {
    return 'nd';
  } 
  if (num === 3) {
    return 'rd';
  }
  return 'th';
};
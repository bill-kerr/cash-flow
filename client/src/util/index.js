import moment from 'moment';

export const getFrequencyDescription = schedule => {
  switch (schedule.frequency) {
    case 'ONCE':
      return `on ${ schedule.startDate }`;
    case 'DAILY':
      if (schedule.interval === 1) return `every day`;
      return `every ${ schedule.interval } days`;
    case 'WEEKLY':
      if (schedule.interval === 1) return `every week on ${ capitalCase(schedule.dayOfWeek) }`;
      return `every ${ schedule.interval } weeks on ${ capitalCase(schedule.dayOfWeek) }`;
    case 'MONTHLY':
      if (schedule.interval === 1) return `every month on the ${ addMonthDateSuffix(schedule.dayOfMonth) }`;
      return `every ${ schedule.interval } months on the ${ addMonthDateSuffix(schedule.dayOfMonth) }`;
    case 'YEARLY':
      if (schedule.interval === 1) return `every year in ${ schedule.month } on the ${ addMonthDateSuffix(schedule.dayOfMonth) }`;
      return `every ${ schedule.interval } years in ${ schedule.month } on the ${ addMonthDateSuffix(schedule.dayOfMonth) }`;
    default:
      return '';
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

export const formatCurrency = (amount, currencyCode, absoluteValue = false) => {
  amount = absoluteValue ? Math.abs(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2
  }).format(amount);
};

export const getCurrencySymbol = currencyCode => {
  const currencySymbols = {
    'usd': '$', // US Dollar
    'eur': '€', // Euro
    'crc': '₡', // Costa Rican Colón
    'gbp': '£', // British Pound Sterling
    'ils': '₪', // Israeli New Sheqel
    'inr': '₹', // Indian Rupee
    'jpy': '¥', // Japanese Yen
    'krw': '₩', // South Korean Won
    'ngn': '₦', // Nigerian Naira
    'php': '₱', // Philippine Peso
    'pln': 'zł', // Polish Zloty
    'pyg': '₲', // Paraguayan Guarani
    'thb': '฿', // Thai Baht
    'uah': '₴', // Ukrainian Hryvnia
    'vnd': '₫', // Vietnamese Dong
  };

  return currencySymbols[currencyCode] || currencyCode;
};

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  return moment(date).format(format);
};
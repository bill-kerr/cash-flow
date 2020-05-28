import request from 'supertest';
import { initExpressApp } from '../../../loaders/express';

const app = initExpressApp();
const url = '/api/v1/transaction-schedules';
const headers = {
  'Authorization': 'Bearer sldjflk',
  'Content-Type': 'application/json'
}

const nonrecurringData: any = {
  amount: 500,
  description: 'test description',
  isRecurring: false,
  startDate: '2020-05-01'
};

const dailyData: any = {
  amount: 500,
  description: 'test description',
  isRecurring: true,
  startDate: '2020-05-01',
  endDate: '2020-05-31',
  frequency: 'DAILY',
  separation: 0
};

const weeklyData: any = {
  amount: 500,
  description: 'test description',
  isRecurring: true,
  startDate: '2020-05-01',
  endDate: '2020-05-31',
  frequency: 'WEEKLY',
  separation: 0,
  dayOfWeek: 'SUNDAY'
};

const monthlyData: any = {
  amount: 500,
  description: 'test description',
  isRecurring: true,
  startDate: '2020-05-01',
  endDate: '2020-05-31',
  frequency: 'MONTHLY',
  separation: 0,
  dayOfMonth: 28
};

const yearlyData: any = {
  amount: 500,
  description: 'test description',
  isRecurring: true,
  startDate: '2020-05-01',
  endDate: '2020-05-31',
  frequency: 'YEARLY',
  separation: 0,
  month: 'OCTOBER',
  dayOfMonth: 28
};

const makeRequest = async (body: {}) => {
  return request(app)
    .post(url)
    .set(headers)
    .send(body);
};

const emptyMessage = (field: string) => {
  return `The ${ field } field is required and cannot be empty.`;
};

const badTypeMessage = (field: string, contains: string) => {
  return `The ${ field } field must contain ${ contains }.`;
};

const shouldNotExistIfMessage = (field: string) => {
  return `The ${ field } field should not exist if isRecurring is set to false.`;
};

const dayOfWeekShouldNotExistMessage = 'The dayOfWeek field should not exist if frequency is not set to \'WEEKLY\'.';
const dayOfMonthShouldNotExistMessage = 'The dayOfMonth field should not exist if frequency is not set to \'MONTHLY\' or \'YEARLY\'.';
const monthShouldNotExistMessage = 'The month field should not exist if frequency is not set to \'YEARLY\'.';

it('sanitizes script tags', async () => {
  const data = { ...nonrecurringData };
  data.description = '<script>alert(\'hello\')</script>';
  const res = await makeRequest(data);
  expect(res.body.description).toBe('&lt;script&gt;alert(&#x27;hello&#x27;)&lt;&#x2F;script&gt;');
});

it('trims whitespace from fields', async () => {
  const data = { ...nonrecurringData };
  data.description = 'test description    ';
  const res = await makeRequest(data);
  expect(res.body.description).toBe('test description');
});

it('rejects unknown fields', async () => {
  const data = { ...nonrecurringData };
  data.test = 'bad data';
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe('Unknown property \'test\' with value \'bad data\'.')
});

it('rejects an empty amount field', async () => {
  const data = { ...nonrecurringData };
  delete data.amount;
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('amount'));
});

it('rejects a non-number amount field', async () => {
  const data = { ...nonrecurringData };
  data.amount = 'test';
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('amount', 'a number'));
});

it('accurately rounds the amount field to two decimal places', async () => {
  let data = { ...nonrecurringData };
  data.amount = 33.335;
  let res = await makeRequest(data);
  expect(res.status).toBe(201);
  expect(res.body.amount).toBe(33.34);

  data = { ...nonrecurringData };
  data.amount = 33.333;
  res = await makeRequest(data);
  expect(res.status).toBe(201);
  expect(res.body.amount).toBe(33.33);
});

it('rejects an empty description field', async () => {
  const data = { ...nonrecurringData };
  delete data.description;
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('description'));
});

it('rejects an empty isRecurring field', async () => {
  const data = { ...nonrecurringData };
  delete data.isRecurring;
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('isRecurring'));
});

it('rejects a non-boolean isRecurring field', async () => {
  const data = { ...nonrecurringData };
  data.isRecurring = 'test';
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('isRecurring', 'a boolean'));
});

it('rejects an empty startDate field', async () => {
  const data = { ...nonrecurringData };
  delete data.startDate;
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('startDate'));
});

it('rejects a non-date startDate field', async () => {
  const data = { ...nonrecurringData };
  data.startDate = 'test';
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));
});

it('rejects recurrence fields when isRecurring is false', async () => {
  const data = { ...nonrecurringData };
  data.endDate = '';
  data.frequency = '';
  data.separation = null;
  data.dayOfWeek = '';
  data.dayOfMonth = null;
  data.month = 'OCTOBER';
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors).toStrictEqual([
    { object: 'error-detail', title: 'Request validation error', detail: shouldNotExistIfMessage('endDate') },
    { object: 'error-detail', title: 'Request validation error', detail: shouldNotExistIfMessage('frequency') },
    { object: 'error-detail', title: 'Request validation error', detail: shouldNotExistIfMessage('separation') },
    { object: 'error-detail', title: 'Request validation error', detail: shouldNotExistIfMessage('dayOfWeek') },
    { object: 'error-detail', title: 'Request validation error', detail: shouldNotExistIfMessage('dayOfMonth') },
    { object: 'error-detail', title: 'Request validation error', detail: shouldNotExistIfMessage('month') },
  ]);
});

it('rejects a non-date endDate field', async () => {
  const data = { ...dailyData };
  data.endDate = 'test';
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('endDate', 'a valid date formatted as YYYY-MM-DD'));
});

it('rejects improperly formatted dates', async () => {
  let data = { ...nonrecurringData };
  data.startDate = '2020/05/26';
  let res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...nonrecurringData };
  data.startDate = '2020-5-26';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...nonrecurringData };
  data.startDate = '2020-05-1';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...nonrecurringData };
  data.startDate = '20-05-1';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...nonrecurringData };
  data.startDate = '05-01-2020';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));
});

it('rejects impossible dates', async () => {
  let data = { ...nonrecurringData };
  data.startDate = '2020-02-30';
  let res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...nonrecurringData };
  data.startDate = '2020-13-01';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...nonrecurringData };
  data.startDate = '2020-04-31';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));
});

it('rejects proper recurrence fields if frequency is daily', async () => {
  const data = { ...dailyData };
  data.month = null;
  data.dayOfMonth = null;
  data.dayOfWeek = null;
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors).toStrictEqual([
    { object: 'error-detail', title: 'Request validation error', detail: dayOfWeekShouldNotExistMessage },
    { object: 'error-detail', title: 'Request validation error', detail: dayOfMonthShouldNotExistMessage },
    { object: 'error-detail', title: 'Request validation error', detail: monthShouldNotExistMessage },
  ]);
});
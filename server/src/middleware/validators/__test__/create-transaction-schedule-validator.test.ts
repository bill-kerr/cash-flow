import request from 'supertest';
import { initExpressApp } from '../../../loaders/express';

const app = initExpressApp();
const url = '/api/v1/transaction-schedules';
const headers = {
  'Authorization': 'Bearer sldjflk',
  'Content-Type': 'application/json'
}

interface Data {
  amount: any,
  description: any,
  isRecurring: any,
  startDate: any,
  endDate: any
}

const fakeData: Data = {
  amount: 500,
  description: 'test description',
  isRecurring: true,
  startDate: '2020-05-01',
  endDate: '2020-05-30'
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

it('rejects an empty amount field', async () => {
  const data = { ...fakeData };
  delete data.amount;
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('amount'));
});

it('rejects a non-number amount field', async () => {
  const data = { ...fakeData };
  data.amount = 'test';
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('amount', 'a number'));
});

it('rejects an empty description field', async () => {
  const data = { ...fakeData };
  delete data.description;
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('description'));
});

it('rejects an empty isRecurring field', async () => {
  const data = { ...fakeData };
  delete data.isRecurring;
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('isRecurring'));
});

it('rejects a non-boolean isRecurring field', async () => {
  const data = { ...fakeData };
  data.isRecurring = 'test';
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('isRecurring', 'a boolean'));
});

it('rejects an empty startDate field', async () => {
  const data = { ...fakeData };
  delete data.startDate;
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('startDate'));
});

it('rejects a non-date startDate field', async () => {
  const data = { ...fakeData };
  data.startDate = 'test';
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));
});

it('allows omission of the endDate field', async () => {
  const data = { ...fakeData };
  delete data.endDate;
  const res = await makeRequest(data);
  expect(res.status).toBe(201);
});

it('rejects a non-date endDate field', async () => {
  const data = { ...fakeData };
  data.endDate = 'test';
  const res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('endDate', 'a valid date formatted as YYYY-MM-DD'));
});

it('rejects improperly formatted dates', async () => {
  let data = { ...fakeData };
  data.startDate = '2020/05/26';
  let res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...fakeData };
  data.startDate = '2020-5-26';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...fakeData };
  data.startDate = '2020-05-1';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...fakeData };
  data.startDate = '20-05-1';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...fakeData };
  data.startDate = '05-01-2020';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));
});

it('rejects impossible dates', async () => {
  let data = { ...fakeData };
  data.startDate = '2020-02-30';
  let res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...fakeData };
  data.startDate = '2020-13-01';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));

  data = { ...fakeData };
  data.startDate = '2020-04-31';
  res = await makeRequest(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));
});
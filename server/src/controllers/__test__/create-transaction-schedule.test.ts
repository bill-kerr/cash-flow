import request from 'supertest';
import { initExpressApp } from '../../loaders/express';

const app = initExpressApp();
const url = '/api/v1/transaction-schedules';
const headers = {
  'Authorization': 'Bearer sldjflk',
  'Content-Type': 'application/json'
};

const fakeData = {
  amount: 500,
  description: 'test description',
  isRecurring: true,
  startDate: '2020-05-01',
  endDate: '2020-05-30',
  frequency: 'YEARLY',
  separation: 0,
  month: 'OCTOBER',
  dayOfMonth: 30
};

const makeRequest = async (body: {}) => {
  return request(app)
    .post(url)
    .set(headers)
    .send(body);
};

it('returns a 201 on successful request', async () => {
  const res = await makeRequest(fakeData);
  expect(res.status).toBe(201);
});

it('returns a properly formatted object on successful request', async () => {
  const res = await makeRequest(fakeData);
  expect(res.body).toEqual({
    id: expect.any(String),
    object: 'transaction-schedule',
    amount: fakeData.amount,
    description: fakeData.description,
    isRecurring: fakeData.isRecurring,
    startDate: fakeData.startDate,
    endDate: fakeData.endDate,
    frequency: fakeData.frequency,
    separation: 0,
    month: fakeData.month,
    dayOfMonth: fakeData.dayOfMonth,
    userId: expect.any(String)
  });
});

it('rejects a request with improperly formatted data', async () => {
  const res = await request(app)
    .post(url)
    .set(headers)
    .send({
      amount: '500',
      description: 123,
      isRecurring: 'nope',
      startDate: '2020-5-01',
      endDate: '2020-05-3'
    })
    .expect(400);
});
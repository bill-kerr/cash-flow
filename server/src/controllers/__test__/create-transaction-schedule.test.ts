import request from 'supertest';
import { initExpressApp } from '../../loaders/express';

const app = initExpressApp();
const url = '/api/v1/transaction-schedules';

const fakeData = {
  amount: 500,
  description: 'test description',
  isRecurring: true,
  startDate: '2020-05-01',
  endDate: '2020-05-30'
};

const makeRequest = async (body: {}) => {
  return request(app)
    .post(url)
    .set({ 
      'Authorization': 'Bearer sldjflk',
      'Content-Type': 'application/json'
    })
    .send(body);
};

it('returns a 201 on successful request', async () => {
  const res = await makeRequest(fakeData);
  expect(res.status).toBe(201);
});


import request from 'supertest';
import { initExpressApp } from '../../loaders/express';
import { TransactionScheduleRepository } from '../../models/transaction-schedule.model';

const app = initExpressApp();
const url = '/api/v1/transaction-schedules';
const headers = {
  'Authorization': 'Bearer sldjflk'
};

const fakeData = {
  amount: 500,
  description: 'test description',
  isRecurring: true,
  startDate: '2020-05-01',
  endDate: '2020-05-30'
};

const makeRequest = async () => {
  return request(app)
    .get(url)
    .set(headers)
    .send();
};

it('retrieves a list of transaction-schedules', async () => {
  await TransactionScheduleRepository.create({ ...fakeData, userId: 'fake-id' });
  await TransactionScheduleRepository.create({ ...fakeData, userId: 'fake-id' });

  const res = await makeRequest();
  expect(res.status).toBe(200);
  expect(res.body.object).toBe('list');
  expect(res.body.data.length).toBe(2);
  expect(res.body.data[0].object).toBe('transaction-schedule');
});

it('only retrieves transaction schedules for the current user', async () => {
  await TransactionScheduleRepository.create({ ...fakeData, userId: 'fake-id' });
  await TransactionScheduleRepository.create({ ...fakeData, userId: 'fake-id' });
  await TransactionScheduleRepository.create({ ...fakeData, userId: 'userTwo' });

  const res = await makeRequest();
  expect(res.status).toBe(200);
  expect(res.body.data.length).toBe(2);
});
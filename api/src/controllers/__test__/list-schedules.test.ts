import request from 'supertest';
import { initExpressApp } from '../../loaders/express';
import { Schedule } from '../../models/schedule.model';

const app = initExpressApp();
const url = '/api/v1/schedules';
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

it('retrieves a list of schedules', async () => {
  await Schedule.create({ ...fakeData, userId: 'fake-id' });
  await Schedule.create({ ...fakeData, userId: 'fake-id' });

  const res = await makeRequest();
  expect(res.status).toBe(200);
  expect(res.body.object).toBe('list');
  expect(res.body.data.length).toBe(2);
  expect(res.body.data[0].object).toBe('schedule');
});

it('only retrieves schedules for the current user', async () => {
  await Schedule.create({ ...fakeData, userId: 'fake-id' });
  await Schedule.create({ ...fakeData, userId: 'fake-id' });
  await Schedule.create({ ...fakeData, userId: 'userTwo' });

  const res = await makeRequest();
  expect(res.status).toBe(200);
  expect(res.body.data.length).toBe(2);
});
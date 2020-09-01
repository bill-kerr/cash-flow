import { makeClient, initialize, TestClient } from '../setup';
import { Frequency } from '../../src/types';
import request from 'supertest';
import { Application } from 'express';
import { ScheduleService } from '../../src/services';
import { getRepository } from 'typeorm';
import { Schedule } from '../../src/entities';

let app: Application;
let exceptionClient: TestClient;
let scheduleClient: TestClient;
beforeAll(async () => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer lsdjkflksd',
  };

  app = await initialize();
  exceptionClient = makeClient('/api/v1/exceptions', headers, app);
  scheduleClient = makeClient('/api/v1/schedules', headers, app);
});

const getTestData = async (
  dtoData: any = { date: '2020-07-09' },
  scheduleData: any = {
    amount: 500,
    description: 'test description',
    frequency: Frequency.DAILY,
    startDate: '2020-07-01',
  }
) => {
  const schedule = (await scheduleClient.post(scheduleData)).body;
  const dto: any = {
    ...dtoData,
    schedule: schedule.id,
  };

  return { dto, schedule };
};

it('creates a correct exception with valid data', async () => {
  const { dto, schedule } = await getTestData();
  let res = await exceptionClient.post(dto);
  expect(res.status).toBe(201);
  expect(res.body).toStrictEqual({
    object: 'exception',
    id: expect.any(String),
    occurrenceDeleted: false,
    currentDate: dto.date,
    amount: null,
    description: null,
    date: dto.date,
    userId: 'fake-id',
    schedule: schedule.id,
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });

  const { dto: dto2, schedule: schedule2 } = await getTestData({
    date: '2020-05-01',
    occurrenceDeleted: true,
    currentDate: '2020-05-02',
    amount: 444,
    description: 'this was changed',
  });
  res = await exceptionClient.post(dto2);
  expect(res.status).toBe(201);
  expect(res.body).toStrictEqual({
    object: 'exception',
    id: expect.any(String),
    occurrenceDeleted: dto2.occurrenceDeleted,
    currentDate: dto2.currentDate,
    amount: dto2.amount,
    description: dto2.description,
    date: dto2.date,
    userId: 'fake-id',
    schedule: schedule2.id,
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });
});

it('overwrites an exception on a given date', async () => {
  const { dto, schedule } = await getTestData();
  let res = await exceptionClient.post(dto);

  const dto2 = { schedule: schedule.id, date: '2020-07-09' };
  res = await exceptionClient.post(dto2);

  expect(res.status).toBe(201);
  expect(res.body).toStrictEqual({
    object: 'exception',
    id: expect.any(String),
    amount: null,
    currentDate: dto2.date,
    occurrenceDeleted: false,
    description: null,
    date: dto2.date,
    userId: 'fake-id',
    schedule: schedule.id,
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });

  res = await request(app)
    .get('/api/v1/exceptions')
    .set({ Authorization: 'Bearer sldjflk', 'Content-Type': 'application/json' })
    .send();
  expect(res.body.data.length).toBe(1);
});

it('rejects exception creation when schedule does not exist', async () => {
  const dto = { schedule: 'shouldnotexist', date: '2020-07-09' };
  const res = await exceptionClient.post(dto);
  expect(res.status).toBe(404);
});

it('disallows requests with an unowned schedule', async () => {
  const scheduleService = new ScheduleService(getRepository(Schedule));
  const schedule = await scheduleService.createSchedule({
    amount: 500,
    description: 'sdfsdf',
    startDate: '2020-05-01',
    frequency: Frequency.DAILY,
    userId: 'test-id',
  });

  const dto = { schedule: schedule.id, date: '2020-07-09' };
  const res = await exceptionClient.post(dto);
  expect(res.status).toBe(404);
});

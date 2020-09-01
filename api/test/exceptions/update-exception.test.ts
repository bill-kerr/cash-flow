import { makeClient, initialize, TestClient } from '../setup';
import { Application } from 'express';
import { Schedule, Exception } from '../../src/entities';
import { ScheduleService, ExceptionService } from '../../src/services';
import { getRepository } from 'typeorm';
import { Frequency } from '../../src/types';

let app: Application;
let exceptionClient: TestClient;
let scheduleClient: TestClient;
let scheduleService: ScheduleService;
let schedule: Schedule;
let exceptionService: ExceptionService;
beforeAll(async () => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer lsdjkflksd',
  };

  app = await initialize();
  exceptionClient = makeClient('/api/v1/exceptions', headers, app);
  scheduleClient = makeClient('/api/v1/schedules', headers, app);
  scheduleService = new ScheduleService(getRepository(Schedule));
  exceptionService = new ExceptionService(scheduleService, getRepository(Exception));
});

beforeEach(async () => {
  schedule = await scheduleService.createSchedule({
    amount: 500,
    description: 'schedule for exception tests',
    frequency: Frequency.DAILY,
    startDate: '2020-05-01',
    userId: 'fake-id',
  });
});

it('updates an exception with a successful request', async () => {
  const exception = await exceptionService.createException({
    userId: 'fake-id',
    date: '2020-07-01',
    schedule: schedule.id,
  });
  const res = await exceptionClient.put({ currentDate: '2020-07-02' }, `/${exception.id}`);

  expect(res.status).toBe(200);
  expect(res.body).toStrictEqual({
    object: 'exception',
    id: exception.id,
    date: '2020-07-01',
    occurrenceDeleted: exception.occurrenceDeleted,
    currentDate: '2020-07-02',
    amount: exception.amount,
    description: exception.description,
    userId: exception.userId,
    schedule: exception.schedule.id,
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });
});

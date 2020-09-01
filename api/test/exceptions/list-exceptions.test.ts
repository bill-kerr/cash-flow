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

it('retrieves a list of exceptions', async () => {
  await exceptionService.createException({ date: '2020-07-01', userId: 'fake-id', schedule: schedule.id });
  const res = await exceptionClient.get();
  expect(res.status).toBe(200);
  expect(res.body.data.length).toBe(1);
});

it('retrieves a list of exceptions for a specific schedule', async () => {
  await exceptionService.createException({ date: '2020-07-01', userId: 'fake-id', schedule: schedule.id });
  const schedule2 = await scheduleService.createSchedule({
    amount: 500,
    description: 'description',
    frequency: Frequency.DAILY,
    startDate: '2020-05-01',
    userId: 'fake-id',
  });
  exceptionService.createException({ date: '2020-07-01', userId: 'fake-id', schedule: schedule2.id });
  const res = await scheduleClient.get(`/${schedule.id}/exceptions`);
  expect(res.status).toBe(200);
  expect(res.body.data.length).toBe(1);
});

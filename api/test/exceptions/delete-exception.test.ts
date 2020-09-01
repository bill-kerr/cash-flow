import { makeClient, initialize, TestClient } from '../setup';
import { Application } from 'express';
import { Schedule, Exception } from '../../src/entities';
import { ScheduleService, ExceptionService } from '../../src/services';
import { getRepository } from 'typeorm';
import { Frequency } from '../../src/types';

let app: Application;
let exceptionClient: TestClient;
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

it('successfully deletes an exception', async () => {
  const exception = await exceptionService.createException({
    date: '2020-05-01',
    schedule: schedule.id,
    userId: 'fake-id',
  });

  let res = await exceptionClient.delete(`/${exception.id}`);
  expect(res.status).toBe(204);
  expect(res.body).toStrictEqual({});

  res = await exceptionClient.get();
  expect(res.body.data.length).toBe(0);
});

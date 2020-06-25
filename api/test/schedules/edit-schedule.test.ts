import request from 'supertest';
import { initExpressApp } from '../../src/loaders/express';
import { scheduleService } from '../../src/services/schedule.service';
import mongoose from 'mongoose';
import { Frequency, DayOfWeek } from '../../src/types';
import { scheduleExceptionService } from '../../src/services/schedule-exception.service';

const app = initExpressApp();
const headers = {
  'Authorization': 'Bearer sldjflk',
  'Content-Type': 'application/json'
};

const makeRequest = async (scheduleId: string, body: {}) => {
  return request(app)
    .put(`/api/v1/schedules/${ scheduleId }`)
    .set(headers)
    .send(body);
};

const testSchedule = {
  amount: 500,
  description: 'test',
  frequency: Frequency.WEEKLY,
  dayOfWeek: DayOfWeek.MONDAY,
  startDate: '2020-05-01',
  endDate: '2020-11-01'
};

const createSchedule = async (schedule = { 
  ...testSchedule, 
  id: mongoose.Types.ObjectId().toHexString(),
  userId: 'fake-id'
}) => scheduleService.createSchedule(schedule);

it('returns a 200 on successful request', async () => {
  const schedule = await createSchedule();
  const res = await makeRequest(schedule.id, { startDate: '2020-05-02' });
  expect(res.status).toBe(200);
});

it('returns the edited schedule on successful request', async () => {
  const schedule = await createSchedule();
  const res = await makeRequest(schedule.id, { 
    startDate: '2020-05-02',
    endDate: '2020-12-01',
    description: 'edited',
    amount: 333
  });
  expect(res.body.startDate).toBe('2020-05-02');
  expect(res.body.description).toBe('edited');
  expect(res.body.amount).toBe(333);
  expect(res.body.endDate).toBe('2020-12-01');
});

it('nulls correct properties on frequency change', async () => {
  const schedule = await createSchedule();
  const res = await makeRequest(schedule.id, {
    frequency: 'MONTHLY',
    dayOfMonth: 15
  });
  expect(res.body.dayOfWeek).toBe(null);
});

it('recalculates the recurrence rule on recurrence field edits', async () => {
  const schedule = await createSchedule();
  let res = await makeRequest(schedule.id, {
    frequency: 'MONTHLY',
    dayOfMonth: 15
  });
  expect(res.body.recurrenceRule)
    .toBe('DTSTART:20200501T000000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15;UNTIL=20201101T000000Z');

  res = await makeRequest(schedule.id, {
    endDate: '2020-07-01'
  });
  expect(res.body.recurrenceRule)
    .toBe('DTSTART:20200501T000000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15;UNTIL=20200701T000000Z');
});

it('removes schedule-exceptions when recurrence properties are changed', async () => {
  const schedule = await createSchedule();
  const exception = await scheduleExceptionService.createScheduleException({
    schedule: schedule.id,
    id: mongoose.Types.ObjectId().toHexString(),
    date: '2020-05-04',
    occurrenceDeleted: true,
    userId: 'fake-id'
  });
  await makeRequest(schedule.id, { frequency: 'MONTHLY', dayOfMonth: 15 });

  const res = await request(app)
    .get(`/api/v1/schedules/${ schedule.id }/schedule-exceptions`)
    .set(headers)
    .send();
  expect(res.body.data.length).toBe(0);
});

it.todo('rejects edits that move the startDate after the endDate');
it.todo('rejects edits that move the endDate before the startDate');
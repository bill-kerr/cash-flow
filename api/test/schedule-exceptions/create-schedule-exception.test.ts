import { initApp, buildMakeRequest } from '../setup';
import { scheduleService } from '../../src/services';
import { Frequency } from '../../src/types';

const app = initApp();
const { makeRequest } = buildMakeRequest('/api/v1/schedule-exceptions');

const getTestData = async (
  dtoData: any = { date: '2020-07-09' }, 
  scheduleData: any = {
    amount: 500,
    description: 'test description',
    frequency: Frequency.DAILY,
    startDate: '2020-07-01',
    userId: 'fake-id'
  }
) => {
  const schedule = await scheduleService.createSchedule(scheduleData);
  const dto: any = {
    ...dtoData,
    schedule: schedule.id
  };

  return { dto, schedule };
};

it('creates a correct schedule-exception with valid data', async () => {
  const { dto, schedule } = await getTestData();
  let res = await makeRequest(dto);
  expect(res.status).toBe(201);
  expect(res.body).toStrictEqual({
    object: 'schedule-exception',
    id: expect.any(String),
    occurrenceDeleted: false,
    currentDate: null,
    amount: null,
    description: null,
    date: dto.date,
    userId: 'fake-id',
    schedule: schedule.id
  });

  const { dto: dto2, schedule: schedule2 } = await getTestData({
    date: '2020-05-01',
    occurrenceDeleted: true,
    currentDate: '2020-05-02',
    amount: 444,
    description: 'this was changed'
  });
  res = await makeRequest(dto2);
  expect(res.status).toBe(201);
  expect(res.body).toStrictEqual({
    object: 'schedule-exception',
    id: expect.any(String),
    occurrenceDeleted: dto2.occurrenceDeleted,
    currentDate: dto2.currentDate,
    amount: dto2.amount,
    description: dto2.description,
    date: dto2.date,
    userId: 'fake-id',
    schedule: schedule2.id
  });
});

it('rejects a second schedule-exception on a single date', async () => {
  const { dto, schedule } = await getTestData();
  let res = await makeRequest(dto);

  const dto2 = { schedule: schedule.id, date: '2020-07-09' };
  res = await makeRequest(dto2);

  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe('A schedule-exception already exists for the occurrence on 2020-07-09.');
});

it('disallows requests with an unowned schedule', async () => {
  const schedule = await scheduleService.createSchedule({
    amount: 500,
    description: 'sdfsdf',
    startDate: '2020-05-01',
    frequency: Frequency.DAILY,
    userId: 'test-id'
  });

  const dto = { schedule: schedule.id, date: '2020-07-09' };
  const res = await makeRequest(dto);

  expect(res.status).toBe(401);
});
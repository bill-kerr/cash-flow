import { scheduleService } from '../../src/services/schedule.service';
import { Frequency } from '../../src/types';
import { initApp, buildMakeRequest, badTypeMessage, emptyMessage } from '../setup';

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

it('allows requests with valid data', async () => {
  const { dto, schedule } = await getTestData();
  let res = await makeRequest(dto);
  expect(res.status).toBe(201);

  const { dto: dto2, schedule: schedule2 } = await getTestData({ 
    date: '2020-07-10', 
    amount: 333, 
    description: 'edited',
    currentDate: '2020-07-11',
    occurrenceDeleted: true
  });
  res = await makeRequest(dto2);
  expect(res.status).toBe(201);
});

it('accepts valid dates', async () => {
  const { dto } = await getTestData();
  dto.currentDate = '2020-05-01';
  const res = await makeRequest(dto);
  expect(res.status).toBe(201);
});

it('rejects invalid dates', async () => {
  let { dto } = await getTestData({ date: '2021-02-29', currentDate: '0000-01-01' });
  let res = await makeRequest(dto);
  expect(res.status).toBe(400);
});

it('rejects invalid booleans', async () => {
  const { dto } = await getTestData();
  dto.occurrenceDeleted = 'BAD_DATA';
  let res = await makeRequest(dto);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('occurrenceDeleted', 'a boolean'));

  const { dto: dto2 } = await getTestData();
  dto2.occurrenceDeleted = null;
  res = await makeRequest(dto2);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('occurrenceDeleted')); 
});

it('rejects invalid floats', async () => {
  const { dto } = await getTestData();
  dto.amount = 'hello';
  let res = await makeRequest(dto);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('amount', 'a number'));

  const { dto: dto2 } = await getTestData();
  dto2.amount = null;
  res = await makeRequest(dto2);
  expect(res.body.errors[0].detail).toBe(emptyMessage('amount'));
});

it('rounds float values to two decimal places', async () => {
  const { dto } = await getTestData();
  dto.amount = 33.333;
  let res = await makeRequest(dto);
  expect(res.body.amount).toBe(33.33);

  const { dto: dto2 } = await getTestData();
  dto2.amount = 33.335;
  res = await makeRequest(dto2);
  expect(res.body.amount).toBe(33.34);
});

it('rejects invalid strings', async () => {
  // const { dto } = await getTestData();
  // dto.description = {};
  // let res = await makeRequest(dto);
  // expect(res.body.errors[0].detail).toBe(badTypeMessage('description', 'a string'));

  const { dto: dto2 } = await getTestData();
  dto2.description = null;
  let res = await makeRequest(dto2);
  expect(res.body.errors[0].detail).toBe(emptyMessage('description'));
});

it('sanitizes script tags', async () => {
  const { dto } = await getTestData({
    description: '<script>alert(\'hello\')</script>',
    date: '2020-07-03'
  });
  
  const res = await makeRequest(dto);
  expect(res.body.description).toBe('&lt;script&gt;alert(&#x27;hello&#x27;)&lt;&#x2F;script&gt;');
});
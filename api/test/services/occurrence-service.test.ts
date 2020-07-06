import { occurrenceService, scheduleService } from '../../src/services';
import { Frequency, DayOfWeek, Month, CreateRecurrenceDto } from '../../src/types';

it('generates non-empty recurrence rules', () => {
  const data: CreateRecurrenceDto = {
    frequency: Frequency.ONCE,
    startDate: '2020-05-01'
  };
  const result = occurrenceService.generateRecurrenceRule(data);
  expect(result).toEqual(expect.any(String));
  expect(result.length).toBeGreaterThan(0);
});

it('creates a correct one-time recurrence rule', () => {
  const data: CreateRecurrenceDto = {
    frequency: Frequency.ONCE,
    startDate: '2020-07-09'
  };

  const result = occurrenceService.generateRecurrenceRule(data);
  expect(result).toEqual('DTSTART:20200709T000000Z\nRRULE:FREQ=DAILY;COUNT=1');
});

it('creates a correct daily recurrence rule', () => {
  const data: CreateRecurrenceDto = {
    frequency: Frequency.DAILY,
    startDate: '2020-07-09'
  };

  const result = occurrenceService.generateRecurrenceRule(data);
  expect(result).toEqual('DTSTART:20200709T000000Z\nRRULE:FREQ=DAILY;INTERVAL=1');
});

it('creates a correct weekly recurrence rule', () => {
  const data: CreateRecurrenceDto = {
    frequency: Frequency.WEEKLY,
    startDate: '2020-07-09',
    dayOfWeek: DayOfWeek.MONDAY
  };

  const result = occurrenceService.generateRecurrenceRule(data);
  expect(result).toEqual('DTSTART:20200709T000000Z\nRRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO');
});

it('creates a correct monthly recurrence rule', () => {
  const data: CreateRecurrenceDto = {
    frequency: Frequency.MONTHLY,
    startDate: '2020-07-09',
    dayOfMonth: 15
  };

  const result = occurrenceService.generateRecurrenceRule(data);
  expect(result).toEqual('DTSTART:20200709T000000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15');
});

it('creates a correct yearly recurrence rule', () => {
  const data: CreateRecurrenceDto = {
    frequency: Frequency.YEARLY,
    startDate: '2020-07-09',
    dayOfMonth: 15,
    month: Month.APRIL
  };

  const result = occurrenceService.generateRecurrenceRule(data);
  expect(result).toEqual('DTSTART:20200709T000000Z\nRRULE:FREQ=YEARLY;INTERVAL=1;BYMONTHDAY=15;BYMONTH=4');
});

it('correctly applies the interval', () => {
  const data: CreateRecurrenceDto = {
    frequency: Frequency.DAILY,
    startDate: '2020-07-09',
    interval: 2
  };

  const result = occurrenceService.generateRecurrenceRule(data);
  expect(result).toEqual('DTSTART:20200709T000000Z\nRRULE:FREQ=DAILY;INTERVAL=2');
});

it('correctly generates the rule when passed 0 for month day', () => {
  const data: CreateRecurrenceDto = {
    frequency: Frequency.YEARLY,
    startDate: '2020-07-09',
    dayOfMonth: 0,
    month: Month.APRIL
  };

  const result = occurrenceService.generateRecurrenceRule(data);
  expect(result).toEqual('DTSTART:20200709T000000Z\nRRULE:FREQ=YEARLY;INTERVAL=1;BYMONTHDAY=28,29,30,31;BYSETPOS=-1;BYMONTH=4');
});

it('creates a valid occurrence when passed good data', async () => {
  const schedule = await scheduleService.createSchedule({
    amount: 500,
    description: 'test',
    frequency: Frequency.DAILY,
    startDate: '2020-07-04',
    userId: 'fake-id'
  });

  const result = await occurrenceService.getOccurrencesBySchedule(schedule, '2020-07-04', '2020-07-09');
  expect(result.length).toEqual(6);
});
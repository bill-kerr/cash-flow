import { Application } from 'express';
import { badTypeMessage, shouldNotBeEmptyMessage, emptyMessage } from '../messages';
import { initialize, TestClient, makeClient } from '../setup';

let app: Application;
let client: TestClient;
beforeAll(async () => {
  app = await initialize();
  client = makeClient(
    '/api/v1/schedules',
    {
      'Content-Type': 'application/json',
      Authorization: 'Bearer lsdjkflksd',
    },
    app
  );
});

const onceData: any = {
  amount: 500,
  frequency: 'ONCE',
  description: 'test description',
  startDate: '2020-05-01',
};

const dailyData: any = {
  amount: 500,
  frequency: 'DAILY',
  description: 'test description',
  startDate: '2020-05-01',
};

const weeklyData: any = {
  amount: 500,
  frequency: 'WEEKLY',
  dayOfWeek: 'MONDAY',
  description: 'test description',
  startDate: '2020-05-01',
};

const monthlyData: any = {
  amount: 500,
  frequency: 'MONTHLY',
  dayOfMonth: 25,
  description: 'test description',
  startDate: '2020-05-01',
};

const yearlyData: any = {
  amount: 500,
  frequency: 'YEARLY',
  dayOfMonth: 25,
  month: 'JANUARY',
  description: 'test description',
  startDate: '2020-05-01',
};

it('accepts valid month values', async () => {
  const months = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];
  months.forEach(async (month) => {
    const data = { ...yearlyData, month };
    const res = await client.post(data);
    expect(res.status).toBe(201);
  });
});

it('sanitizes script tags', async () => {
  const data = {
    amount: 500,
    frequency: 'ONCE',
    description: "<script>alert('hello')</script>",
    startDate: '2020-05-01',
  };

  const res = await client.post(data);
  expect(res.body.description).toBe('&lt;script&gt;alert(&#x27;hello&#x27;)&lt;&#x2F;script&gt;');
});

it('trims whitespace from fields', async () => {
  const data = { ...onceData, description: 'test description     ' };
  const res = await client.post(data);
  expect(res.body.description).toBe('test description');
});

it('rejects unknown fields', async () => {
  const data = { ...onceData, test: 'bad data' };
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe("Unknown property 'test' with value 'bad data'.");
});

it('rejects an empty amount field', async () => {
  const data = { ...onceData };
  delete data.amount;
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('amount'));
});

it('rejects a non-integer amount field', async () => {
  const data = { ...onceData, amount: 'test' };
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('amount', 'an integer'));

  const data2 = { ...onceData, amount: 55.55 };
  const res2 = await client.post(data2);
  expect(res2.status).toBe(400);
});

it('accepts valid amount values', async () => {
  const amounts = [-500, 25, 5555555, 42];
  amounts.forEach(async (amount) => {
    const data = { ...onceData, amount };
    const res = await client.post(data);
    expect(res.status).toBe(201);
  });
});

it('rejects an empty description field', async () => {
  const data = { ...onceData };
  delete data.description;
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('description'));
});

it('accepts valid description values', async () => {
  const descriptions = [-500, 25, 5555555, 42, true, false, 'sdlkjfls', '\ndlskfds'];
  descriptions.forEach(async (desc) => {
    const data = { ...onceData, description: desc };
    const res = await client.post(data);
    expect(res.status).toBe(201);
  });
});

it('rejects an empty startDate field', async () => {
  const data = { ...onceData };
  delete data.startDate;
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('startDate'));
});

it('rejects a non-date startDate field', async () => {
  const data = { ...onceData, startDate: 'test' };
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));
});

it('accepts valid startDate and endDate values', async () => {
  const startDates = ['2020-05-01', '2025-12-31', '2020-02-20', '1990-05-04'];
  const endDates = startDates;

  startDates.forEach(async (date) => {
    const data = { ...onceData, startDate: date };
    const res = await client.post(data);
    expect(res.status).toBe(201);
  });

  endDates.forEach(async (date) => {
    const data = { ...onceData, startDate: '1800-05-01', endDate: date };
    const res = await client.post(data);
    expect(res.status).toBe(201);
  });
});

it('rejects a non-date endDate field', async () => {
  const data = { ...dailyData, endDate: 'test' };
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('endDate', 'a valid date formatted as YYYY-MM-DD'));
});

it('rejects improperly formatted dates', async () => {
  const dates = ['2020/05/26', '2020-5-26', '2020-05-1', '20-05-1', '05-01-2020'];
  dates.forEach(async (date) => {
    const data = { ...onceData, startDate: date };
    const res = await client.post(data);
    expect(res.status).toBe(400);
    expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));
  });
});

it('rejects impossible dates', async () => {
  const dates = ['2020-02-30', '2020-13-01', '2020-04-31', '0000-01-01', '0100-01-01'];
  dates.forEach(async (date) => {
    const data = { ...onceData, startDate: date };
    const res = await client.post(data);
    expect(res.status).toBe(400);
    expect(res.body.errors[0].detail).toBe(badTypeMessage('startDate', 'a valid date formatted as YYYY-MM-DD'));
  });
});

it('rejects an empty frequency field', async () => {
  const data = { ...dailyData };
  delete data.frequency;
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(emptyMessage('frequency'));
});

it('rejects a non-frequency frequency field', async () => {
  const data = { ...dailyData, frequency: 'BAD_DATA' };
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(
    badTypeMessage('frequency', "one of 'ONCE', 'DAILY', 'WEEKLY', 'MONTHLY', or 'YEARLY'")
  );
});

it('accepts valid frequency values', async () => {
  const freqs = ['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
  freqs.forEach(async (freq) => {
    const data = { ...onceData, frequency: freq, dayOfMonth: 25, month: 'JULY', dayOfWeek: 'FRIDAY' };
    const res = await client.post(data);
    expect(res.status).toBe(201);
  });
});

it('defaults the interval field to 1 if omitted', async () => {
  const res = await client.post(dailyData);
  expect(res.body.interval).toBe(1);
});

it('rejects a non-integer interval field', async () => {
  const data = { ...dailyData, interval: 33.33 };
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('interval', 'an integer not less than one'));
});

it('rejects a non-positive interval field', async () => {
  const data = { ...dailyData, interval: -2 };
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(badTypeMessage('interval', 'an integer not less than one'));
});

it('accepts valid interval values', async () => {
  const ints = [500, 25, 5555555, 42];
  ints.forEach(async (int) => {
    const data = { ...weeklyData, interval: int };
    const res = await client.post(data);
    expect(res.status).toBe(201);
  });
});

it('requires the dayOfWeek field when frequency is set to WEEKLY', async () => {
  const data = { ...weeklyData };
  delete data.dayOfWeek;
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(shouldNotBeEmptyMessage('dayOfWeek', "'WEEKLY'"));
});

it('rejects a non-weekday dayOfWeek field', async () => {
  const data = { ...weeklyData, dayOfWeek: 'BAD_DATA' };
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(
    badTypeMessage(
      'dayOfWeek',
      "one of 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', or 'SATURDAY'"
    )
  );
});

it('accepts valid dayOfWeek values', async () => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  days.forEach(async (day) => {
    const data = { ...weeklyData, dayOfWeek: day };
    const res = await client.post(data);
    expect(res.status).toBe(201);
  });
});

it('requires the dayOfMonth field when frequency is set to MONTHLY or YEARLY', async () => {
  const message = shouldNotBeEmptyMessage('dayOfMonth', "'MONTHLY' or 'YEARLY'");

  let data = { ...monthlyData };
  delete data.dayOfMonth;
  let res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(message);

  data = { ...yearlyData };
  delete data.dayOfMonth;
  res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(message);
});

it('rejects a non-integer dayOfMonth field', async () => {
  const days = ['bad data', false, 22.56, {}];
  days.forEach(async (day) => {
    const data = { ...monthlyData, dayOfMonth: day };
    const res = await client.post(data);
    expect(res.status).toBe(400);
    expect(res.body.errors[0].detail).toBe(badTypeMessage('dayOfMonth', 'an integer between 0 and 31'));
  });
});

it('rejects numbers not between 0 and 31 for the dayOfMonth field', async () => {
  const days = [32, -1];
  days.forEach(async (day) => {
    const data = { ...monthlyData, dayOfMonth: day };
    const res = await client.post(data);
    expect(res.status).toBe(400);
    expect(res.body.errors[0].detail).toBe(badTypeMessage('dayOfMonth', 'an integer between 0 and 31'));
  });
});

it('accepts valid dayOfMonth values', async () => {
  let data = { ...monthlyData, dayOfMonth: 25 };
  let res = await client.post(data);
  expect(res.status).toBe(201);

  data = { ...monthlyData, dayOfMonth: 1 };
  res = await client.post(data);
  expect(res.status).toBe(201);

  data = { ...monthlyData, dayOfMonth: 31 };
  res = await client.post(data);
  expect(res.status).toBe(201);

  data = { ...monthlyData, dayOfMonth: 0 };
  res = await client.post(data);
  expect(res.status).toBe(201);
});

it('requires the month field when frequency is set to YEARLY', async () => {
  const data = { ...yearlyData };
  delete data.month;
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(shouldNotBeEmptyMessage('month', "'YEARLY'"));
});

it('rejects a non-month month field', async () => {
  const data = { ...yearlyData, month: 'BAD_DATA' };
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe(
    badTypeMessage(
      'month',
      "one of 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', or 'DECEMBER'"
    )
  );
});

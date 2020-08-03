import { initialize, TestClient, makeClient } from "../setup";
import { Application } from "express";

let app: Application;
let client: TestClient;
beforeAll(async () => {
  app = await initialize();
  client = makeClient(
    "/api/v1/schedules",
    {
      "Content-Type": "application/json",
      Authorization: "Bearer lsdjkflksd",
    },
    app
  );
});

const testData = {
  amount: 500,
  description: "test description",
  startDate: "2020-05-01",
  endDate: "2020-05-30",
  frequency: "DAILY",
  interval: 1,
};

it("returns a 201 on successful request", async () => {
  const res = await client.post(testData);
  expect(res.status).toBe(201);
});

it("returns a properly formatted object on successful request", async () => {
  const res = await client.post(testData);
  expect(res.body).toEqual({
    id: expect.any(String),
    object: "schedule",
    amount: testData.amount,
    description: testData.description,
    startDate: testData.startDate,
    endDate: testData.endDate,
    frequency: testData.frequency,
    recurrenceRule: expect.any(String),
    interval: 1,
    occurrenceCount: null,
    dayOfWeek: null,
    month: null,
    dayOfMonth: null,
    userId: expect.any(String),
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });
});

it("rejects a request with improperly formatted data", async () => {
  const res = await client.post({
    amount: "500",
    description: 123,
    startDate: "2020-5-01",
    endDate: "2020-05-3",
  });
  expect(res.status).toBe(400);
});

it("rejects a request when endDate is before startDate", async () => {
  const data = {
    amount: 500,
    description: "test",
    frequency: "DAILY",
    startDate: "2020-05-01",
    endDate: "2020-04-01",
  };

  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe("The end date must occur after the start date.");
});

it("creates a schedule with occurrences on the last day of the month when dayOfMonth is set to 0", async () => {
  const scheduleRes = await client.post({
    userId: "fake-id",
    amount: 500,
    description: "test",
    frequency: "MONTHLY",
    dayOfMonth: 0,
    startDate: "2020-01-01",
  });
  const id = scheduleRes.body.id;

  const res = await client.get(`/${id}/occurrences?startDate=2020-01-01&endDate=2021-03-01`);
  console.log(res.body);
  const occurrences = res.body.data;
  expect(occurrences[0].date).toBe("2020-01-31");
  expect(occurrences[3].date).toBe("2020-04-30");
  expect(occurrences[1].date).toBe("2020-02-29");
  expect(occurrences[occurrences.length - 1].date).toBe("2021-02-28");
});

it("sets unnecessary fields to null on once schedule creation", async () => {
  const data = {
    amount: 500,
    description: "test",
    frequency: "ONCE",
    dayOfWeek: "SUNDAY",
    month: "MARCH",
    interval: 2,
    occurrenceCount: 3,
    dayOfMonth: 15,
    startDate: "2020-05-01",
    endDate: "2020-05-06",
  };
  const res = await client.post(data);

  const schedule = res.body;
  expect(schedule.month).toBe(null);
  expect(schedule.dayOfWeek).toBe(null);
  expect(schedule.dayOfMonth).toBe(null);
  expect(schedule.interval).toBe(1);
  expect(schedule.occurrenceCount).toBe(null);
  expect(schedule.endDate).toBe(null);
});

it("sets unnecessary fields to null on daily schedule creation", async () => {
  const data = {
    amount: 500,
    description: "test",
    frequency: "DAILY",
    dayOfWeek: "SUNDAY",
    month: "MARCH",
    dayOfMonth: 15,
    startDate: "2020-05-01",
  };
  const res = await client.post(data);

  const schedule = res.body;
  expect(schedule.month).toBe(null);
  expect(schedule.dayOfWeek).toBe(null);
  expect(schedule.dayOfMonth).toBe(null);
});

it("sets unnecessary fields to null on weekly schedule creation", async () => {
  const data = {
    amount: 500,
    description: "test",
    frequency: "WEEKLY",
    dayOfWeek: "SUNDAY",
    month: "MARCH",
    dayOfMonth: 15,
    startDate: "2020-05-01",
  };
  const res = await client.post(data);

  const schedule = res.body;
  expect(schedule.month).toBe(null);
  expect(schedule.dayOfMonth).toBe(null);
});

it("sets unnecessary fields to null on monthly schedule creation", async () => {
  const data = {
    amount: 500,
    description: "test",
    frequency: "MONTHLY",
    dayOfWeek: "SUNDAY",
    month: "MARCH",
    dayOfMonth: 15,
    startDate: "2020-05-01",
  };
  const res = await client.post(data);

  const schedule = res.body;
  expect(schedule.month).toBe(null);
  expect(schedule.dayOfWeek).toBe(null);
});

it("sets unnecessary fields to null on yearly schedule creation", async () => {
  const data = {
    amount: 500,
    description: "test",
    frequency: "YEARLY",
    dayOfWeek: "SUNDAY",
    month: "MARCH",
    dayOfMonth: 15,
    startDate: "2020-05-01",
  };
  const res = await client.post(data);

  const schedule = res.body;
  expect(schedule.dayOfWeek).toBe(null);
});

it("sets endDate to null when occurrrenceCount is set", async () => {
  const data = {
    amount: 500,
    description: "test",
    frequency: "DAILY",
    occurrenceCount: 3,
    startDate: "2020-05-01",
    endDate: "2020-05-25",
  };
  const res = await client.post(data);
  expect(res.body.endDate).toBe(null);
});

it("rejects schedules that have no occurrences", async () => {
  const data = {
    amount: 4,
    description: "test",
    frequency: "YEARLY",
    dayOfMonth: 15,
    month: "DECEMBER",
    startDate: "2020-01-01",
    endDate: "2020-12-01",
  };
  const res = await client.post(data);
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe("The provided schedule has no occurrences.");
});

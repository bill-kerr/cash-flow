import { makeClient, initialize, TestClient } from "../setup";
import { Frequency } from "../../src/types";
import request from "supertest";
import { Application } from "express";
import { ScheduleService } from "../../src/services";
import { getRepository } from "typeorm";
import { Schedule } from "../../src/entities";

let app: Application;
let client: TestClient;
beforeAll(async () => {
  app = await initialize();
  client = makeClient(
    "/api/v1/exceptions",
    {
      "Content-Type": "application/json",
      Authorization: "Bearer lsdjkflksd",
    },
    app
  );
});

const getTestData = async (
  dtoData: any = { date: "2020-07-09" },
  scheduleData: any = {
    amount: 500,
    description: "test description",
    frequency: Frequency.DAILY,
    startDate: "2020-07-01",
    userId: "fake-id",
  }
) => {
  const scheduleService = new ScheduleService(getRepository(Schedule));
  const schedule = await scheduleService.createSchedule(scheduleData);
  const dto: any = {
    ...dtoData,
    schedule: schedule.id,
  };

  return { dto, schedule };
};

it("creates a correct exception with valid data", async () => {
  const { dto, schedule } = await getTestData();
  let res = await client.post(dto);
  expect(res.status).toBe(201);
  expect(res.body).toStrictEqual({
    object: "exception",
    id: expect.any(String),
    occurrenceDeleted: false,
    currentDate: null,
    amount: null,
    description: null,
    date: dto.date,
    userId: "fake-id",
    schedule: schedule.id,
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });

  const { dto: dto2, schedule: schedule2 } = await getTestData({
    date: "2020-05-01",
    occurrenceDeleted: true,
    currentDate: "2020-05-02",
    amount: 444,
    description: "this was changed",
  });
  res = await client.post(dto2);
  expect(res.status).toBe(201);
  expect(res.body).toStrictEqual({
    object: "exception",
    id: expect.any(String),
    occurrenceDeleted: dto2.occurrenceDeleted,
    currentDate: dto2.currentDate,
    amount: dto2.amount,
    description: dto2.description,
    date: dto2.date,
    userId: "fake-id",
    schedule: schedule2.id,
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });
});

it("overwrites an exception on a given date", async () => {
  const { dto, schedule } = await getTestData();
  let res = await client.post(dto);

  const dto2 = { scheduleId: schedule.id, date: "2020-07-09" };
  res = await client.post(dto2);

  expect(res.status).toBe(201);
  expect(res.body).toStrictEqual({
    object: "exception",
    id: expect.any(String),
    amount: null,
    currentDate: null,
    occurrenceDeleted: false,
    description: null,
    date: dto2.date,
    userId: "fake-id",
    schedule: schedule.id,
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });

  res = await request(app)
    .get("/api/v1/exceptions")
    .set({ Authorization: "Bearer sldjflk", "Content-Type": "application/json" })
    .send();
  expect(res.body.data.length).toBe(1);
});

it("disallows requests with an unowned schedule", async () => {
  const scheduleService = new ScheduleService(getRepository(Schedule));
  const schedule = await scheduleService.createSchedule({
    amount: 500,
    description: "sdfsdf",
    startDate: "2020-05-01",
    frequency: Frequency.DAILY,
    userId: "test-id",
  });

  const dto = { schedule: schedule.id, date: "2020-07-09" };
  const res = await client.post(dto);

  expect(res.status).toBe(400);
});

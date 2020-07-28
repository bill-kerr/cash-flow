import request from "supertest";
import { initExpressApp } from "../../src/loaders/express";
import { Frequency } from "../../src/types";
import { Schedule } from "../../src/entities";
import { scheduleService } from "../../src/services";

const app = initExpressApp();
const headers = {
  Authorization: "Bearer sldjflk",
  "Content-Type": "application/json",
};

const makeRequest = async (scheduleId: string, startDate: string, endDate: string) => {
  return request(app)
    .get(`/api/v1/schedules/${scheduleId}/occurrences`)
    .set(headers)
    .query({ startDate, endDate })
    .send();
};

const createSchedule = async (): Promise<Schedule> => {
  return scheduleService.createSchedule({
    userId: "fake-id",
    amount: 500,
    description: "test description",
    frequency: Frequency.DAILY,
    startDate: "2020-05-01",
  });
};

it("returns a properly formatted list of occurrences on successful request", async () => {
  const schedule = await createSchedule();
  const startDate = "2020-05-01";
  const res = await makeRequest(schedule.id, startDate, "2021-05-01");
  expect(res.status).toBe(200);
  expect(res.body.object).toBe("list");
  expect(res.body.data.length).toBe(366);
  expect(res.body.data[0]).toStrictEqual({
    object: "occurrence",
    date: schedule.startDate,
    originalDate: startDate,
    amount: schedule.amount,
    description: schedule.description,
    schedule: schedule.id,
  });
});

it("rejects requests without the startDate and endDate query parameters", async () => {
  const schedule = await createSchedule();
  const res = await request(app).get(`/api/v1/schedules/${schedule.id}/occurrences`).set(headers).send();

  expect(res.status).toBe(400);
});

it("limits occurrences to the correct occurrenceCount", async () => {
  const schedule = await scheduleService.createSchedule({
    userId: "fake-id",
    amount: 500,
    description: "test description",
    frequency: Frequency.DAILY,
    occurrenceCount: 3,
    startDate: "2020-05-01",
  });

  const res = await makeRequest(schedule.id, "2020-05-01", "2020-07-01");
  expect(res.body.data.length).toBe(3);
});

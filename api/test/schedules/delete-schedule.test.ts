import request from "supertest";
import { initExpressApp } from "../../src/loaders/express";
import { scheduleService } from "../../src/services";
import { Frequency, DayOfWeek } from "../../src/types";

const app = initExpressApp();
const headers = {
  Authorization: "Bearer sldjflk",
  "Content-Type": "application/json",
};

const makeRequest = async (scheduleId: string) => {
  return request(app).delete(`/api/v1/schedules/${scheduleId}`).set(headers).send();
};

const testSchedule = {
  amount: 500,
  description: "test",
  frequency: Frequency.WEEKLY,
  dayOfWeek: DayOfWeek.MONDAY,
  startDate: "2020-05-01",
  endDate: "2020-11-01",
};

const createSchedule = async (
  schedule = {
    ...testSchedule,
    userId: "fake-id",
  }
) => scheduleService.createSchedule(schedule);

it("deletes a schedule on successful request", async () => {
  const schedule = await createSchedule();
  let res = await makeRequest(schedule.id);
  expect(res.status).toBe(200);

  res = await request(app).get(`/api/v1/schedules`).set(headers).send();
  expect(res.body.data.length).toBe(0);
});

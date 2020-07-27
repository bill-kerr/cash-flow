import request from "supertest";
import { initExpressApp } from "../../src/loaders/express";
import { Schedule } from "../../src/models";
import { scheduleService } from "../../src/services";
import { Frequency } from "../../src/types";

const app = initExpressApp();
const url = "/api/v1/schedules";
const headers = {
  Authorization: "Bearer sldjflk",
};

const fakeData = {
  amount: 500,
  description: "test description",
  frequency: Frequency.ONCE,
  startDate: "2020-05-01",
  endDate: "2020-05-30",
};

const makeRequest = async () => {
  return request(app).get(url).set(headers).send();
};

it("retrieves a list of schedules", async () => {
  await Schedule.create({ ...fakeData, userId: "fake-id", id: "schedule1" });
  await Schedule.create({ ...fakeData, userId: "fake-id", id: "schedule2" });

  const res = await makeRequest();
  expect(res.status).toBe(200);
  expect(res.body.object).toBe("list");
  expect(res.body.data.length).toBe(2);
  expect(res.body.data[0].object).toBe("schedule");
});

it("only retrieves schedules for the current user", async () => {
  await scheduleService.createSchedule({ ...fakeData, userId: "fake-id" });
  await scheduleService.createSchedule({ ...fakeData, userId: "fake-id" });
  await scheduleService.createSchedule({ ...fakeData, userId: "user-two" });

  const res = await makeRequest();
  expect(res.status).toBe(200);
  expect(res.body.data.length).toBe(2);
});

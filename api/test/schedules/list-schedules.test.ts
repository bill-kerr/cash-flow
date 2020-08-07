import { ScheduleService } from "../../src/services";
import { Frequency } from "../../src/types";
import { getRepository } from "typeorm";
import { Schedule } from "../../src/entities";
import { TestClient, initialize, makeClient } from "../setup";
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
  frequency: Frequency.ONCE,
  startDate: "2020-05-01",
  endDate: "2020-05-30",
};

it("retrieves a list of schedules", async () => {
  const scheduleService = new ScheduleService(getRepository(Schedule));
  await scheduleService.createSchedule({ ...testData, userId: "fake-id", id: "schedule1" });
  await scheduleService.createSchedule({ ...testData, userId: "fake-id", id: "schedule2" });

  const res = await client.get();
  expect(res.status).toBe(200);
  expect(res.body.object).toBe("list");
  expect(res.body.data.length).toBe(2);
  expect(res.body.data[0].object).toBe("schedule");
});

it("only retrieves schedules for the current user", async () => {
  const scheduleService = new ScheduleService(getRepository(Schedule));
  await scheduleService.createSchedule({ ...testData, userId: "fake-id" });
  await scheduleService.createSchedule({ ...testData, userId: "fake-id" });
  await scheduleService.createSchedule({ ...testData, userId: "user-two" });

  const res = await client.get();
  expect(res.status).toBe(200);
  expect(res.body.data.length).toBe(2);
});

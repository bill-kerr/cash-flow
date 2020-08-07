import { ScheduleService } from "../../src/services";
import { Frequency, DayOfWeek } from "../../src/types";
import { getRepository } from "typeorm";
import { Schedule } from "../../src/entities";
import { Application } from "express";
import { TestClient, initialize, makeClient } from "../setup";

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
) => {
  const scheduleService = new ScheduleService(getRepository(Schedule));
  return scheduleService.createSchedule(schedule);
};

it("deletes a schedule on successful request", async () => {
  const schedule = await createSchedule();
  let res = await client.delete(`/${schedule.id}`);
  expect(res.status).toBe(200);

  res = await client.get();
  expect(res.body.data.length).toBe(0);
});

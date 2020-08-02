import request from "supertest";
import { initExpressApp } from "../../src/loaders/express";
import { ScheduleService } from "../../src/services";
import { Frequency, DayOfWeek } from "../../src/types";
import { getRepository } from "typeorm";
import { Schedule } from "../../src/entities";

const app = initExpressApp();
const headers = {
  Authorization: "Bearer sldjflk",
  "Content-Type": "application/json",
};

const makeRequest = async (scheduleId: string, body: {}) => {
  return request(app).put(`/api/v1/schedules/${scheduleId}`).set(headers).send(body);
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
) => {
  const scheduleService = new ScheduleService(getRepository(Schedule));
  return scheduleService.createSchedule(schedule);
};

it("returns a 200 on successful request", async () => {
  const schedule = await createSchedule();
  const res = await makeRequest(schedule.id, { startDate: "2020-05-02" });
  expect(res.status).toBe(200);
});

it("returns the updated schedule on successful request", async () => {
  const schedule = await createSchedule();
  const res = await makeRequest(schedule.id, {
    startDate: "2020-05-02",
    endDate: "2020-12-01",
    description: "updated",
    amount: 333,
  });
  expect(res.body.startDate).toBe("2020-05-02");
  expect(res.body.description).toBe("updated");
  expect(res.body.amount).toBe(333);
  expect(res.body.endDate).toBe("2020-12-01");
});

it("nulls correct properties on frequency change", async () => {
  const schedule = await createSchedule();
  const res = await makeRequest(schedule.id, {
    frequency: "MONTHLY",
    dayOfMonth: 15,
  });
  expect(res.body.dayOfWeek).toBe(null);
});

it("recalculates the recurrence rule on recurrence field updates", async () => {
  const schedule = await createSchedule();
  let res = await makeRequest(schedule.id, {
    frequency: "MONTHLY",
    dayOfMonth: 15,
  });
  expect(res.body.recurrenceRule).toBe(
    "DTSTART:20200501T000000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;UNTIL=20201101T000000Z;BYMONTHDAY=15"
  );

  res = await makeRequest(schedule.id, {
    endDate: "2020-07-01",
  });
  expect(res.body.recurrenceRule).toBe(
    "DTSTART:20200501T000000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;UNTIL=20200701T000000Z;BYMONTHDAY=15"
  );
});

it("rejects updates that move the startDate or endDate to an invalid order", async () => {
  const schedule = await createSchedule();
  let res = await makeRequest(schedule.id, { startDate: "2020-12-01" });
  expect(res.status).toBe(400);

  res = await makeRequest(schedule.id, { startDate: "2020-06-01", endDate: "2020-05-25" });
  expect(res.status).toBe(400);

  res = await makeRequest(schedule.id, { endDate: "2020-04-25" });
  expect(res.status).toBe(400);
});

it("allows endDates to be removed by passing null", async () => {
  const schedule = await createSchedule();
  schedule.endDate = "2020-12-31";
  await schedule.save();

  const res = await makeRequest(schedule.id, { endDate: null });
  expect(res.status).toBe(200);
  expect(res.body.endDate).toBe(null);
});

it("rejects updates that result in a schedule with no occurrences", async () => {
  const schedule = await createSchedule();

  const res = await makeRequest(schedule.id, { endDate: "2020-05-03" });
  expect(res.status).toBe(400);
  expect(res.body.errors[0].detail).toBe("The updated schedule has no occurrences.");
});

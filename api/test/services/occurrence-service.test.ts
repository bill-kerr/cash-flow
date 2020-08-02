import { ScheduleService, OccurrenceService, ExceptionService } from "../../src/services";
import { Frequency } from "../../src/types";
import { getRepository } from "typeorm";
import { Schedule, Exception } from "../../src/entities";

// TODO: more tests that actually test the occurrence service. This is the only one.
it("creates a valid occurrence when passed good data", async () => {
  const scheduleService = new ScheduleService(getRepository(Schedule));
  const exceptionService = new ExceptionService(scheduleService, getRepository(Exception));
  const occurrenceService = new OccurrenceService(exceptionService);

  const schedule = await scheduleService.createSchedule({
    amount: 500,
    description: "test",
    frequency: Frequency.DAILY,
    startDate: "2020-07-04",
    userId: "fake-id",
  });

  const result = await occurrenceService.getOccurrencesBySchedule(schedule, "2020-07-04", "2020-07-09");
  expect(result.length).toEqual(6);
});

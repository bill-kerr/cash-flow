import { recurrenceRule, hasOccurrences, getOccurrences } from "../util/recurrence";
import { CreateScheduleDto } from "../types";
import { Occurrence, Schedule, Exception } from "../entities";
import { ExceptionService } from "./exception";

export class OccurrenceService {
  constructor(private exceptionService: ExceptionService) {}

  private createOccurrence(schedule: Schedule, date: string, exception?: Exception | null): Occurrence {
    return {
      object: "occurrence",
      date: exception?.currentDate || date,
      amount: exception?.amount || schedule.amount,
      description: exception?.description || schedule.description,
      schedule: schedule.id,
      originalDate: date,
    };
  }

  private showOccurrence(exception: Exception | null | undefined, startDate: string, endDate: string): boolean {
    if (!exception || exception.occurrenceDeleted) {
      return false;
    }

    const date = exception.currentDate || exception.date;
    if (date >= startDate && date <= endDate) {
      return true;
    }

    return false;
  }

  public async getOccurrencesBySchedules(
    schedules: Schedule[],
    startDate: string,
    endDate: string
  ): Promise<Occurrence[]> {
    const occurrences: Occurrence[] = [];

    for (const schedule of schedules) {
      const scheduleOccurrences = await this.getOccurrencesBySchedule(schedule, startDate, endDate);
      occurrences.push(...scheduleOccurrences);
    }

    occurrences.sort((a, b) => (a.date > b.date ? 1 : -1));
    return occurrences;
  }

  // TODO: refactor this
  public async getOccurrencesBySchedule(schedule: Schedule, startDate: string, endDate: string): Promise<Occurrence[]> {
    const occurrenceDates = this.getOccurrenceDates(schedule.recurrenceRule, startDate, endDate);
    const exceptions = await this.exceptionService.getExceptionsByScheduleId(schedule.id);
    exceptions.map((exception) => {
      if (!occurrenceDates.includes(exception.date)) {
        occurrenceDates.push(exception.date);
      }
    });

    const occurrences: Occurrence[] = [];
    occurrenceDates.forEach((date) => {
      const exception = exceptions.find((exception) => exception.date === date);
      if (this.showOccurrence(exception, startDate, endDate)) {
        occurrences.push(this.createOccurrence(schedule, date, exception));
      } else if (!exception) {
        occurrences.push(this.createOccurrence(schedule, date));
      }
    });

    return occurrences;
  }

  // TODO: test this
  public async getOccurrences(schedule: Schedule, startDate: string, endDate: string): Promise<Occurrence[]> {
    const occurrenceDates: { [key: string]: Exception | null } = {};
    this.getOccurrenceDates(schedule.recurrenceRule, startDate, endDate).map((date) => (occurrenceDates[date] = null));

    const exceptions = await this.exceptionService.getExceptionsByScheduleId(schedule.id);
    exceptions.map((exception) => (occurrenceDates[exception.date] = exception));

    const occurrences: Occurrence[] = [];
    Object.keys(occurrenceDates).map((date) => {
      const exception = occurrenceDates[date];
      if (this.showOccurrence(exception, startDate, endDate)) {
        occurrences.push(this.createOccurrence(schedule, date, exception));
      } else if (!exception) {
        occurrences.push(this.createOccurrence(schedule, date));
      }
    });
    return occurrences;
  }

  public scheduleHasOccurrencesBetween(
    schedule: Schedule | CreateScheduleDto,
    startDate: string,
    endDate: string | null
  ): boolean {
    if (!schedule.endDate || !endDate) {
      return true;
    }

    const rrule = schedule.recurrenceRule || recurrenceRule(schedule);
    return hasOccurrences(rrule, startDate, endDate);
  }

  public getOccurrenceDates(recurrenceRule: string, startDate: string, endDate: string): string[] {
    return getOccurrences(recurrenceRule, startDate, endDate);
  }

  public async scheduleHasOccurrenceOn(schedule: Schedule, date: string): Promise<boolean> {
    return hasOccurrences(schedule.recurrenceRule, date, date);
  }
}

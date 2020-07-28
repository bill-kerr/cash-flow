import { RRule, rrulestr } from "rrule";
import { getUTCDateFromString, parseUTCDateList } from "../util";
import { Frequency, DayOfWeek, Month, CreateRecurrenceDto, CreateScheduleDto } from "../types";
import { scheduleService, exceptionService } from ".";
import { Occurrence, Schedule, Exception } from "../entities";

class OccurrenceService {
  private readonly FREQUENCIES = {
    [Frequency.ONCE]: RRule.DAILY,
    [Frequency.DAILY]: RRule.DAILY,
    [Frequency.WEEKLY]: RRule.WEEKLY,
    [Frequency.MONTHLY]: RRule.MONTHLY,
    [Frequency.YEARLY]: RRule.YEARLY,
  };

  private readonly WEEKDAYS = {
    [DayOfWeek.SUNDAY]: RRule.SU,
    [DayOfWeek.MONDAY]: RRule.MO,
    [DayOfWeek.TUESDAY]: RRule.TU,
    [DayOfWeek.WEDNESDAY]: RRule.WE,
    [DayOfWeek.THURSDAY]: RRule.TH,
    [DayOfWeek.FRIDAY]: RRule.FR,
    [DayOfWeek.SATURDAY]: RRule.SA,
  };

  private readonly MONTHS = {
    [Month.JANUARY]: 1,
    [Month.FEBRUARY]: 2,
    [Month.MARCH]: 3,
    [Month.APRIL]: 4,
    [Month.MAY]: 5,
    [Month.JUNE]: 6,
    [Month.JULY]: 7,
    [Month.AUGUST]: 8,
    [Month.SEPTEMBER]: 9,
    [Month.OCTOBER]: 10,
    [Month.NOVEMBER]: 11,
    [Month.DECEMBER]: 12,
  };

  private getMonthDayRule(monthDay?: number | null): { bymonthday?: number[]; bysetpos?: number } {
    if (monthDay === undefined || monthDay === null) {
      return {};
    }

    if (monthDay === 0) {
      return { bymonthday: [28, 29, 30, 31], bysetpos: -1 };
    }

    return { bymonthday: [monthDay] };
  }

  private rruleHasOccurrencesBetween(rrule: string, startDate: string, endDate: string): boolean {
    const rule = rrulestr(rrule);
    const occurrences = rule.between(getUTCDateFromString(startDate), getUTCDateFromString(endDate), true);
    return occurrences.length > 0;
  }

  private createOccurrence(schedule: Schedule, date: string, exception?: Exception): Occurrence {
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

  public generateRecurrenceRule(dto: CreateRecurrenceDto): string {
    const startDate = getUTCDateFromString(dto.startDate);
    const endDate = dto.endDate ? getUTCDateFromString(dto.endDate) : null;

    const rule = new RRule({
      freq: this.FREQUENCIES[dto.frequency],
      count: dto.frequency === Frequency.ONCE ? 1 : dto.occurrenceCount,
      interval: dto.frequency !== Frequency.ONCE ? dto.interval || 1 : undefined,
      dtstart: startDate,
      until: endDate,
      byweekday: dto.dayOfWeek ? this.WEEKDAYS[dto.dayOfWeek] : null,
      ...this.getMonthDayRule(dto.dayOfMonth),
      bymonth: dto.month ? this.MONTHS[dto.month] : null,
    });

    return rule.toString();
  }

  public async getOccurrencesByUser(userId: string, startDate: string, endDate: string): Promise<Occurrence[]> {
    const schedules = await scheduleService.getSchedules(userId);
    const occurrences: Occurrence[] = [];

    for (const schedule of schedules) {
      const scheduleOccurrences = await this.getOccurrencesBySchedule(schedule, startDate, endDate);
      occurrences.push(...scheduleOccurrences);
    }

    occurrences.sort((a, b) => (a.date > b.date ? 1 : -1));
    return occurrences;
  }

  public async getOccurrencesBySchedule(schedule: Schedule, startDate: string, endDate: string): Promise<Occurrence[]> {
    const occurrenceDates = this.getOccurrenceDates(schedule.recurrenceRule, startDate, endDate);
    const exceptions = await exceptionService.getExceptionsByScheduleId(schedule.id);
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

  public scheduleHasOccurrencesBetween(
    schedule: Schedule | CreateScheduleDto,
    startDate: string,
    endDate: string | null
  ): boolean {
    if (!schedule.endDate || !endDate) {
      return true;
    }

    const rrule = schedule.recurrenceRule || this.generateRecurrenceRule(schedule);
    return this.rruleHasOccurrencesBetween(rrule, startDate, endDate);
  }

  public getOccurrenceDates(recurrenceRule: string, startDate: string, endDate: string): string[] {
    const rule = rrulestr(recurrenceRule);
    const dates = rule.between(getUTCDateFromString(startDate), getUTCDateFromString(endDate), true);
    return parseUTCDateList(dates);
  }

  public async scheduleHasOccurrenceOn(scheduleId: string, date: string): Promise<boolean> {
    const schedule = await scheduleService.getScheduleById(scheduleId);
    return this.rruleHasOccurrencesBetween(schedule.recurrenceRule, date, date);
  }
}

const occurrenceService = new OccurrenceService();
Object.freeze(occurrenceService);
export { occurrenceService };

import { RRule, rrulestr } from 'rrule';
import { getUTCDateFromString, parseUTCDateList, buildDateFilter } from '../util';
import { Frequency, DayOfWeek, Month } from '../types';
import { CreateRecurrenceDto } from '../models/dto/recurrence.dto';
import { scheduleService } from './schedule.service';
import { Occurrence } from '../models/occurrence.model';
import { ScheduleDoc } from '../models/schedule.model';
import { CreateScheduleDto } from '../models/dto/schedule.dto';
import { scheduleExceptionService } from '../services/schedule-exception.service';
import { ScheduleExceptionDoc } from '../models/schedule-exception.model';

class OccurrenceService {

  private readonly FREQUENCIES = {
    [Frequency.ONCE]: RRule.DAILY,
    [Frequency.DAILY]: RRule.DAILY,
    [Frequency.WEEKLY]: RRule.WEEKLY,
    [Frequency.MONTHLY]: RRule.MONTHLY,
    [Frequency.YEARLY]: RRule.YEARLY
  };

  private readonly WEEKDAYS = {
    [DayOfWeek.SUNDAY]: RRule.SU,
    [DayOfWeek.MONDAY]: RRule.MO,
    [DayOfWeek.TUESDAY]: RRule.TU,
    [DayOfWeek.WEDNESDAY]: RRule.WE,
    [DayOfWeek.THURSDAY]: RRule.TH,
    [DayOfWeek.FRIDAY]: RRule.FR,
    [DayOfWeek.SATURDAY]: RRule.SA
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

  private getMonthDayRule(monthDay?: number): { bymonthday?: number[], bysetpos?: number } {
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

  private createOccurrence(
    schedule: ScheduleDoc,
    date: string,
    exception?: ScheduleExceptionDoc
  ): Occurrence {
    return {
      object: 'occurrence',
      date: exception?.currentDate || date,
      amount: exception?.amount || schedule.amount,
      description: exception?.description || schedule.description,
      schedule: schedule.id
    };
  }

  public generateRecurrenceRule(dto: CreateRecurrenceDto): string {
    const startDate = getUTCDateFromString(dto.startDate);
    const endDate = dto.endDate ? getUTCDateFromString(dto.endDate) : null;

    const rule = new RRule({
      freq: this.FREQUENCIES[dto.frequency],
      count: dto.frequency === Frequency.ONCE ? 1 : null,
      interval: dto.frequency !== Frequency.ONCE ? dto.interval || 1 : undefined,
      dtstart: startDate,
      until: endDate,
      byweekday: dto.dayOfWeek ? this.WEEKDAYS[dto.dayOfWeek] : null,
      ...this.getMonthDayRule(dto.dayOfMonth),
      bymonth: dto.month ? this.MONTHS[dto.month] : null
    });

    return rule.toString();
  }

  public async getOccurrencesByUser(userId: string, startDate: string, endDate: string): Promise<Occurrence[]> {
    const dateFilter = buildDateFilter(startDate, endDate);
    const schedules = await scheduleService.getSchedules(userId, dateFilter);
    const occurrences: Occurrence[] = [];

    schedules.map(async schedule => {
      const scheduleOccurrences = await this.getOccurrencesBySchedule(schedule, startDate, endDate);
      occurrences.push(...scheduleOccurrences);
    });

    occurrences.sort((a, b) => a.date > b.date ? 1 : -1);
    return occurrences;
  }

  public async getOccurrencesBySchedule(
    schedule: ScheduleDoc, 
    startDate: string, 
    endDate: string
  ): Promise<Occurrence[]> {
    const occurrenceDates = this.getOccurrenceDates(schedule.recurrenceRule, startDate, endDate);
    const exceptions = await scheduleExceptionService.getScheduleExceptionsBySchedule(schedule.id);
    const occurrences: Occurrence[] = [];

    occurrenceDates.forEach(date => {
      const exception = exceptions.find(exception => exception.date === date);
      if (exception && !exception.occurrenceDeleted) {
        occurrences.push(this.createOccurrence(schedule, date, exception));
      } else if (!exception) {
        occurrences.push(this.createOccurrence(schedule, date));
      }
    });

    return occurrences;
  }

  public scheduleHasOccurrencesBetween(
    schedule: ScheduleDoc | CreateScheduleDto, 
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
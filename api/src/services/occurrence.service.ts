import { RRule, rrulestr } from 'rrule';
import { getUTCDateFromString, parseUTCDateList } from '../util';
import { Frequency, DayOfWeek, Month } from '../types';
import { CreateScheduleDto } from '../models/dto/schedule.dto';
import { ScheduleDoc, Schedule } from '../models/schedule.model';
import { Occurrence } from '../models/occurrence.model';
import { scheduleExceptionService } from './schedule-exception.service';

const WeekDays = {
  [DayOfWeek.SUNDAY]: RRule.SU,
  [DayOfWeek.MONDAY]: RRule.MO,
  [DayOfWeek.TUESDAY]: RRule.MO,
  [DayOfWeek.WEDNESDAY]: RRule.MO,
  [DayOfWeek.THURSDAY]: RRule.MO,
  [DayOfWeek.FRIDAY]: RRule.MO,
  [DayOfWeek.SATURDAY]: RRule.MO
};

const Months = {
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

class OccurrenceService {
  private generateOnceRecurrenceRule(interval = 1, startDate: string): string {
    const rule = new RRule({
      freq: RRule.DAILY,
      count: 1,
      interval,
      dtstart: getUTCDateFromString(startDate),
      until: null
    });

    return rule.toString();
  }

  private generateDailyRecurrenceRule(interval = 1, startDate: string, endDate?: string): string {
    const rule = new RRule({
      freq: RRule.DAILY,
      interval,
      dtstart: getUTCDateFromString(startDate),
      until: endDate ? getUTCDateFromString(endDate) : null
    });

    return rule.toString();
  }

  private generateWeeklyRecurrenceRule(
    dayOfWeek = DayOfWeek.MONDAY, 
    interval = 1, 
    startDate: string, 
    endDate?: string
  ): string {
    const rule = new RRule({
      freq: RRule.WEEKLY,
      byweekday: [WeekDays[dayOfWeek]],
      interval,
      dtstart: getUTCDateFromString(startDate),
      until: endDate ? getUTCDateFromString(endDate) : null
    });

    return rule.toString();
  }

  private generateMonthlyRecurrenceRule(
    dayOfMonth = 1, 
    interval = 1, 
    startDate: string, 
    endDate?: string
  ): string {
    const rule = new RRule({
      freq: RRule.MONTHLY,
      interval,
      dtstart: getUTCDateFromString(startDate),
      bymonthday: [dayOfMonth],
      until: endDate ? getUTCDateFromString(endDate) : null
    });

    return rule.toString();
  }

  private generateYearlyRecurrenceRule(
    month = Month.JANUARY,
    dayOfMonth = 1, 
    interval = 1, 
    startDate: string, 
    endDate?: string
  ): string {
    const rule = new RRule({
      freq: RRule.YEARLY,
      interval,
      dtstart: getUTCDateFromString(startDate),
      bymonthday: [dayOfMonth],
      bymonth: [Months[month]],
      until: endDate ? getUTCDateFromString(endDate) : null
    });

    return rule.toString();
  }

  private getOccurrenceDates(recurrenceRule: string, startDate: string, endDate: string): string[] {
    const rule = rrulestr(recurrenceRule);
    const dates = rule.between(getUTCDateFromString(startDate), getUTCDateFromString(endDate), true);
    return parseUTCDateList(dates);
  }

  public generateRecurrenceRule(dto: CreateScheduleDto) {
    switch(dto.frequency) {
      case Frequency.ONCE:
        return this.generateOnceRecurrenceRule(dto.interval, dto.startDate);
      case Frequency.DAILY:
        return this.generateDailyRecurrenceRule(dto.interval, dto.startDate, dto.endDate);
      case Frequency.WEEKLY:
        return this.generateWeeklyRecurrenceRule(dto.dayOfWeek, dto.interval, dto.startDate, dto.endDate);
      case Frequency.MONTHLY:
        return this.generateMonthlyRecurrenceRule(dto.dayOfMonth, dto.interval, dto.startDate, dto.endDate);
      case Frequency.YEARLY:
        return this.generateYearlyRecurrenceRule(dto.month, dto.dayOfMonth, dto.interval, dto.startDate, dto.endDate);
    }
  }

  public async scheduleHasOccurrenceOn(scheduleId: string, date: string): Promise<boolean> {
    const schedule = await Schedule.findOne({ id: scheduleId });

    if (!schedule) {
      return false;
    }

    const rule = rrulestr(schedule.recurrenceRule);
    const occurrence = rule.between(getUTCDateFromString(date), getUTCDateFromString(date), true);
    return occurrence.length > 0;
  }

  public async getOccurrencesByUser(userId: string, startDate: string, endDate: string): Promise<Occurrence[]> {
    const schedules = await Schedule.find({ userId });
    const occurrences: Occurrence[] = [];

    for (const schedule of schedules) {
      const scheduleOccurrences = await this.getOccurrencesBySchedule(schedule, startDate, endDate);
      occurrences.push(...scheduleOccurrences);
    }

    occurrences.sort((a, b) => a.date > b.date ? 1 : -1);
    return occurrences;
  }

  public async getOccurrencesBySchedule(
    schedule: ScheduleDoc, 
    startDate: string, 
    endDate: string
  ): Promise<Occurrence[]> {
    const occurrenceDates = this.getOccurrenceDates(schedule.recurrenceRule, startDate, endDate);
    const exceptions = await scheduleExceptionService.getScheduleExceptions(schedule.id, startDate, endDate);

    const occurrences: Occurrence[] = [];
    occurrenceDates.forEach(date => {
      const exception = exceptions.find(exception => exception.date === date);
      if (exception && !exception.deleted) {
        occurrences.push(exception.createOccurrence(schedule.id, date));
      } else if (!exception) {
        occurrences.push(schedule.createOccurrence(date)); 
      }
    });

    return occurrences;
  }
}

const occurrenceService = new OccurrenceService();
Object.freeze(occurrenceService);
export { occurrenceService };
import { RRule, rrulestr, RRuleSet } from "rrule";
import moment from "moment";
import { DayOfWeek, Month, Frequency, CreateRecurrenceDto } from "../types";
import { getUTCDateFromString } from ".";
import config from "../config";
import { parseUTCDateList } from "./dates";

const FREQUENCIES = {
  [Frequency.ONCE]: RRule.DAILY,
  [Frequency.DAILY]: RRule.DAILY,
  [Frequency.WEEKLY]: RRule.WEEKLY,
  [Frequency.MONTHLY]: RRule.MONTHLY,
  [Frequency.YEARLY]: RRule.YEARLY,
};

const WEEKDAYS = {
  [DayOfWeek.SUNDAY]: RRule.SU,
  [DayOfWeek.MONDAY]: RRule.MO,
  [DayOfWeek.TUESDAY]: RRule.TU,
  [DayOfWeek.WEDNESDAY]: RRule.WE,
  [DayOfWeek.THURSDAY]: RRule.TH,
  [DayOfWeek.FRIDAY]: RRule.FR,
  [DayOfWeek.SATURDAY]: RRule.SA,
};

const MONTHS = {
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

export function getMonthDayRule(monthDay?: number | null): { bymonthday?: number[]; bysetpos?: number } {
  if (monthDay === undefined || monthDay === null) {
    return {};
  }

  if (monthDay === 0) {
    return { bymonthday: [28, 29, 30, 31], bysetpos: -1 };
  }

  return { bymonthday: [monthDay] };
}

export function hasOccurrences(rrule: string, startDate: string, endDate?: string | null): boolean {
  if (!endDate) {
    endDate = moment().add(config.maxYears, "years").format("YYYY-MM-DD");
  }

  const rule = rrulestr(rrule);
  const occurrences = rule.between(getUTCDateFromString(startDate), getUTCDateFromString(endDate), true);
  return occurrences.length > 0;
}

export function recurrenceRule(dto: CreateRecurrenceDto): string {
  const startDate = getUTCDateFromString(dto.startDate);
  const endDate = dto.endDate ? getUTCDateFromString(dto.endDate) : null;

  const rule = new RRule({
    freq: FREQUENCIES[dto.frequency],
    count: dto.frequency === Frequency.ONCE ? 1 : dto.occurrenceCount,
    interval: dto.frequency !== Frequency.ONCE ? dto.interval || 1 : undefined,
    dtstart: startDate,
    until: endDate,
    byweekday: dto.dayOfWeek ? WEEKDAYS[dto.dayOfWeek] : null,
    ...getMonthDayRule(dto.dayOfMonth),
    bymonth: dto.month ? MONTHS[dto.month] : null,
  });

  return rule.toString();
}

export function getOccurrences(recurrenceRule: string, startDate: string, endDate: string, inclusive = true) {
  const rule = parseRecurrenceRule(recurrenceRule);
  const dates = rule.between(getUTCDateFromString(startDate), getUTCDateFromString(endDate), inclusive);
  return parseUTCDateList(dates);
}

function parseRecurrenceRule(rule: string): RRule | RRuleSet {
  return rrulestr(rule);
}

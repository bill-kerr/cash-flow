import { Schedule, Exception, Occurrence } from "../entities";
import { UpdateScheduleDto, CreateScheduleDto, CreateExceptionDto, UpdateExceptionDto } from "../types";

export interface IScheduleService {
  getSchedules(userId: string): Promise<Schedule[]>;
  getScheduleById(scheduleId: string, userId: string, loadExceptions?: boolean): Promise<Schedule>;
  createSchedule(dto: CreateScheduleDto): Promise<Schedule>;
  updateSchedule(dto: UpdateScheduleDto): Promise<Schedule>;
  deleteSchedule(scheduleId: string, userId: string): Promise<Schedule>;
}

export interface IExceptionService {
  getExceptionById(exceptionId: string, userId: string, loadSchedule?: boolean): Promise<Exception>;
  getExceptionByScheduleAndDate(schedule: Schedule, date: string): Promise<Exception | undefined>;
  getExceptionsBySchedule(schedule: Schedule): Promise<Exception[]>;
  getExceptionsByUser(userId: string): Promise<Exception[]>;
  createException(dto: CreateExceptionDto): Promise<Exception>;
  updateException(dto: UpdateExceptionDto): Promise<Exception>;
  deleteException(exceptionId: string, userId: string): Promise<Exception>;
}

export interface IOccurrenceService {
  getOccurrencesBySchedules(schedules: Schedule[], startDate: string, endDate: string): Promise<Occurrence[]>;
  getOccurrencesBySchedule(schedule: Schedule, startDate: string, endDate: string): Promise<Occurrence[]>;
  scheduleHasOccurrencesBetween(
    schedule: Schedule | CreateScheduleDto,
    startDate: string,
    endDate: string | null
  ): boolean;
  getOccurrenceDates(recurrenceRule: string, startDate: string, endDate: string): string[];
  scheduleHasOccurrenceOn(schedule: Schedule, date: string): boolean;
}

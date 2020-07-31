import { omit } from "lodash";
import { Frequency, CreateScheduleDto, UpdateScheduleDto } from "../types";
import { Schedule } from "../entities";
import { BadRequestError, NotAuthorizedError } from "../errors";
import { Repository } from "typeorm";
import { recurrenceRule, hasOccurrences } from "../util/recurrence";

export class ScheduleService {
  constructor(private repository: Repository<Schedule>) {}

  private removeUnnecessaryFields(dto: CreateScheduleDto): CreateScheduleDto {
    dto = dto.occurrenceCount ? omit(dto, "endDate") : dto;

    switch (dto.frequency) {
      case Frequency.ONCE:
        return omit(dto, ["month", "dayOfWeek", "dayOfMonth", "endDate", "interval", "occurrenceCount"]);
      case Frequency.DAILY:
        return omit(dto, ["month", "dayOfMonth", "dayOfWeek"]);
      case Frequency.WEEKLY:
        return omit(dto, ["dayOfMonth", "month"]);
      case Frequency.MONTHLY:
        return omit(dto, ["dayOfWeek", "month"]);
      case Frequency.YEARLY:
        return omit(dto, "dayOfWeek");
      default:
        return dto;
    }
  }

  private nullUnnecessaryFields(schedule: Schedule) {
    switch (schedule.frequency) {
      case Frequency.ONCE:
        return this.repository.merge(schedule, {
          interval: 1,
          occurrenceCount: null,
          month: null,
          dayOfWeek: null,
          dayOfMonth: null,
          endDate: null,
        });
      case Frequency.DAILY:
        return this.repository.merge(schedule, {
          month: null,
          dayOfWeek: null,
          dayOfMonth: null,
          endDate: schedule.occurrenceCount ? null : schedule.endDate,
        });
      case Frequency.WEEKLY:
        return this.repository.merge(schedule, {
          month: null,
          dayOfMonth: null,
          endDate: schedule.occurrenceCount ? null : schedule.endDate,
        });
      case Frequency.MONTHLY:
        return this.repository.merge(schedule, {
          month: null,
          dayOfWeek: null,
          endDate: schedule.occurrenceCount ? null : schedule.endDate,
        });
      case Frequency.YEARLY:
        return this.repository.merge(schedule, {
          dayOfWeek: null,
          endDate: schedule.occurrenceCount ? null : schedule.endDate,
        });
    }
  }

  private validateDates(schedule: Schedule, dto: UpdateScheduleDto) {
    if (dto.startDate && dto.endDate) {
      if (dto.startDate > dto.endDate) {
        throw new BadRequestError("The start date must occur before the end date.");
      }
    }

    if (dto.startDate && !dto.endDate && schedule.endDate) {
      if (dto.startDate >= schedule.endDate) {
        throw new BadRequestError("The start date must occur before the existing end date.");
      }
    }

    if (dto.endDate && !dto.startDate) {
      if (dto.endDate <= schedule.startDate) {
        throw new BadRequestError("The end date must occur after the existing start date.");
      }
    }
  }

  public createSchedule(dto: CreateScheduleDto): Promise<Schedule> {
    dto = this.removeUnnecessaryFields(dto);
    dto.recurrenceRule = recurrenceRule(dto);

    if (dto.endDate && dto.endDate < dto.startDate) {
      throw new BadRequestError("The end date must occur after the start date.");
    }

    if (dto.endDate && !hasOccurrences(recurrenceRule(dto), dto.startDate, dto.endDate)) {
      throw new BadRequestError("The provided schedule has no occurrences.");
    }

    return this.repository.create(dto).save();
  }

  public getSchedules(userId: string): Promise<Schedule[]> {
    return this.repository.find({ userId });
  }

  public async getScheduleById(scheduleId: string, userId: string, loadExceptions = false): Promise<Schedule> {
    const relations = loadExceptions ? ["exceptions"] : [];
    const schedule = await this.repository.findOne({ id: scheduleId, userId }, { relations });

    if (!schedule) {
      throw new NotAuthorizedError();
    }
    return schedule;
  }

  public async deleteSchedule(scheduleId: string, userId: string): Promise<Schedule> {
    const schedule = await this.getScheduleById(scheduleId, userId);
    return schedule.remove();
  }

  public async updateSchedule(dto: UpdateScheduleDto): Promise<Schedule> {
    if (!dto.id) {
      throw new BadRequestError("A schedule id must be supplied to update a schedule.");
    }
    const schedule = await this.getScheduleById(dto.id, dto.userId);

    if (dto.endDate === "") {
      dto.endDate = null;
    }

    this.validateDates(schedule, dto);
    this.repository.update(schedule, dto);
    this.nullUnnecessaryFields(schedule);
    schedule.recurrenceRule = recurrenceRule({ ...schedule });

    if (!hasOccurrences(schedule.recurrenceRule, schedule.startDate, schedule.endDate)) {
      throw new BadRequestError("The updated schedule has no occurrences.");
    }

    return schedule.save();
  }
}

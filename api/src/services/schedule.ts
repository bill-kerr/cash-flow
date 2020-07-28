import { omit } from "lodash";
import { Frequency, CreateScheduleDto, UpdateScheduleDto } from "../types";
import { Schedule } from "../entities";
import { BadRequestError, NotAuthorizedError } from "../errors";
import { occurrenceService } from ".";

class ScheduleService {
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
        return schedule.update({
          interval: 1,
          occurrenceCount: null,
          month: null,
          dayOfWeek: null,
          dayOfMonth: null,
          endDate: null,
        });
      case Frequency.DAILY:
        return schedule.update({
          month: null,
          dayOfWeek: null,
          dayOfMonth: null,
          endDate: schedule.occurrenceCount ? null : schedule.endDate,
        });
      case Frequency.WEEKLY:
        return schedule.update({
          month: null,
          dayOfMonth: null,
          endDate: schedule.occurrenceCount ? null : schedule.endDate,
        });
      case Frequency.MONTHLY:
        return schedule.update({
          month: null,
          dayOfWeek: null,
          endDate: schedule.occurrenceCount ? null : schedule.endDate,
        });
      case Frequency.YEARLY:
        return schedule.update({
          dayOfWeek: null,
          endDate: schedule.occurrenceCount ? null : schedule.endDate,
        });
    }
  }

  private validateDates(dto: UpdateScheduleDto, schedule: Schedule) {
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

  async createSchedule(dto: CreateScheduleDto): Promise<Schedule> {
    dto = this.removeUnnecessaryFields(dto);
    dto.recurrenceRule = occurrenceService.generateRecurrenceRule(dto);

    if (dto.endDate && dto.endDate < dto.startDate) {
      throw new BadRequestError("The end date must occur after the start date.");
    }

    if (dto.endDate && !occurrenceService.scheduleHasOccurrencesBetween(dto, dto.startDate, dto.endDate)) {
      throw new BadRequestError("The provided schedule has no occurrences.");
    }

    const schedule = Schedule.create(dto);
    await schedule.save();
    return schedule;
  }

  async getSchedules(userId: string): Promise<Schedule[]> {
    return Schedule.find({ userId });
  }

  async getScheduleById(scheduleId: string): Promise<Schedule> {
    const schedule = await Schedule.findOne({ id: scheduleId });

    if (!schedule) {
      throw new NotAuthorizedError();
    }

    return schedule;
  }

  async getScheduleOccurrences(scheduleId: string, startDate: string, endDate: string) {
    const schedule = await this.getScheduleById(scheduleId);
    return occurrenceService.getOccurrencesBySchedule(schedule, startDate, endDate);
  }

  async deleteSchedule(scheduleId: string): Promise<Schedule> {
    const schedule = await this.getScheduleById(scheduleId);
    await schedule.remove();
    return schedule;
  }

  async updateSchedule(dto: UpdateScheduleDto): Promise<Schedule> {
    if (!dto.id) {
      throw new BadRequestError("A schedule id must be supplied to update a schedule.");
    }
    const schedule = await this.getScheduleById(dto.id);

    if (dto.endDate === "") {
      dto.endDate = null;
    }

    this.validateDates(dto, schedule);

    schedule.update({ ...dto });
    this.nullUnnecessaryFields(schedule);
    schedule.recurrenceRule = occurrenceService.generateRecurrenceRule({ ...schedule });

    if (!occurrenceService.scheduleHasOccurrencesBetween(schedule, schedule.startDate, schedule.endDate)) {
      throw new BadRequestError("The updated schedule has no occurrences.");
    }

    await schedule.save();
    return schedule;
  }
}

const scheduleService = new ScheduleService();
Object.freeze(scheduleService);
export { scheduleService };

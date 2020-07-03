import { CreateScheduleExceptionDto } from '../models/dto/schedule-exception.dto';
import { ScheduleExceptionDoc, ScheduleException } from '../models/schedule-exception.model';
import { NotFoundError, BadRequestError, NotAuthorizedError } from '../errors';
import { occurrenceService } from './occurrence.service';
import { scheduleService } from './schedule.service';

class ScheduleExceptionService {

  private buildDateFilter(startDate?: string, endDate?: string) {
    const filter: any = {};

    if (startDate) {
      filter.$gte = startDate;
    }

    if (endDate) {
      filter.$lte = endDate;
    }

    return filter;
  }

  private async populateMissingFields(dto: CreateScheduleExceptionDto): Promise<CreateScheduleExceptionDto> {
    const populatedDto = { ...dto };
    const schedule = await scheduleService.getScheduleById(dto.schedule);

    if (!populatedDto.description) {
      populatedDto.description = schedule.description;
    }

    if (!populatedDto.amount) {
      populatedDto.amount = schedule.amount;
    }

    if (!populatedDto.occurrenceDeleted) {
      populatedDto.occurrenceDeleted = false;
    }

    return populatedDto;
  }

  async getScheduleException(scheduleId: string,  date: string): Promise<ScheduleExceptionDoc> {
    const exception = await ScheduleException.findOne({ schedule: scheduleId, date });

    if (!exception) {
      throw new NotFoundError(`No schedule-exception exists for the specified schedule on ${ date }.`);
    }

    return exception;
  }

  async getScheduleExceptionById(id: string): Promise<ScheduleExceptionDoc> {
    const exception = await ScheduleException.findOne({ id });

    if (!exception) {
      throw new NotAuthorizedError();
    }

    return exception;
  }

  async scheduleExceptionExists(scheduleId: string, date: string): Promise<boolean> {
    const exception = await ScheduleException.findOne({ schedule: scheduleId, date });
    return !!exception;
  }

  async getScheduleExceptions(
    scheduleId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<ScheduleExceptionDoc[]> {
    const filters: any = {
      schedule: scheduleId
    };

    if (startDate || endDate) {
      filters.date = this.buildDateFilter(startDate, endDate);
    }

    const exceptions = await ScheduleException.find(filters);
    return exceptions;
  }

  async getScheduleExceptionsByUser(
    userId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<ScheduleExceptionDoc[]> {
    const schedules = await scheduleService.getSchedules(userId);
    const scheduleIds = schedules.map(schedule => schedule.id);
    const filters: any = { schedule: { $in: scheduleIds } };

    if (startDate || endDate) {
      filters.date = this.buildDateFilter(startDate, endDate);
    }

    const exceptions = await ScheduleException.find(filters);
    return exceptions;
  }

  async createScheduleException(dto: CreateScheduleExceptionDto): Promise<ScheduleExceptionDoc> {
    if (!dto.amount && !dto.occurrenceDeleted && !dto.description) {
      throw new BadRequestError(
        'A schedule-exception must include one of \'amount\', \'description\', or \'occurrenceDeleted\''
      );
    }

    if (await this.scheduleExceptionExists(dto.schedule, dto.date)) {
      throw new BadRequestError(`A schedule-exception already exists on ${ dto.date }.`);
    }

    if (!await occurrenceService.scheduleHasOccurrenceOn(dto.schedule, dto.date)) {
      throw new BadRequestError(`The specified schedule does not occur on ${ dto.date }.`);
    }

    const data = await this.populateMissingFields(dto);
    const exception = ScheduleException.build(data);
    await exception.save();
    return exception;
  }

  async deleteScheduleException(id: string): Promise<ScheduleExceptionDoc> {
    const exception = await this.getScheduleExceptionById(id);
    exception.remove();
    return exception;
  }

  async deleteScheduleExceptionsBySchedule(scheduleId: string) {
    const exceptions = await ScheduleException.find({ schedule: scheduleId });
    exceptions.map(async exception => await exception.remove());
  }

}

const scheduleExceptionService = new ScheduleExceptionService();
Object.freeze(scheduleExceptionService);
export { scheduleExceptionService };
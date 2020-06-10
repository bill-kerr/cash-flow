import { CreateScheduleExceptionDto } from '../models/dto/schedule-exception.dto';
import { ScheduleExceptionDoc, ScheduleException } from '../models/schedule-exception.model';
import { NotFoundError } from '../errors/not-found-error';
import { BadRequestError } from '../errors/bad-request-error';
import { occurrenceService } from './occurrence.service';
import { scheduleService } from './schedule.service';
import { NotAuthorizedError } from '../errors/not-authorized-error';

class ScheduleExceptionService {

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
    startDate: string, 
    endDate: string
  ): Promise<ScheduleExceptionDoc[]> {
    const exceptions = await ScheduleException.find({ 
      schedule: scheduleId,
      date: { $gte: startDate, $lte: endDate }
    });

    return exceptions;
  }

  async getScheduleExceptionsByUser(userId: string): Promise<ScheduleExceptionDoc[]> {
    const schedules = await scheduleService.getSchedules(userId);
    const scheduleIds = schedules.map(schedule => schedule.id);
    const exceptions = await ScheduleException.find({
      schedule: { $in: scheduleIds }
    });

    return exceptions;
  }

  async createScheduleException(dto: CreateScheduleExceptionDto): Promise<ScheduleExceptionDoc> {
    if (await this.scheduleExceptionExists(dto.schedule, dto.date)) {
      throw new BadRequestError(`A schedule-exception already exists on ${ dto.date }.`);
    }

    if (!await occurrenceService.scheduleHasOccurrenceOn(dto.schedule, dto.date)) {
      throw new BadRequestError(`The specified schedule does not occur on ${ dto.date }.`);
    }

    const exception = ScheduleException.build(dto);
    await exception.save();
    return exception;
  }

}

const scheduleExceptionService = new ScheduleExceptionService();
Object.freeze(scheduleExceptionService);
export { scheduleExceptionService };
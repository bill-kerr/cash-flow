import { CreateScheduleExceptionDto, EditScheduleExceptionDto } from '../types';
import { ScheduleExceptionDoc, ScheduleException } from '../models';
import { BadRequestError, NotAuthorizedError } from '../errors';

class ScheduleExceptionService {
  private async scheduleExceptionExists(
    scheduleId: string, 
    date: string
  ): Promise<ScheduleExceptionDoc | null> {
    const exception = await ScheduleException.findOne({ schedule: scheduleId, date });
    return exception;
  }

  public async getScheduleExceptionById(id: string): Promise<ScheduleExceptionDoc> {
    const exception = await ScheduleException.findOne({ id });
    if (!exception) {
      throw new NotAuthorizedError();
    }

    return exception;
  }

  public async getScheduleExceptionsBySchedule(scheduleId: string): Promise<ScheduleExceptionDoc[]> {
    const exceptions = await ScheduleException.find({ schedule: scheduleId });
    return exceptions;
  }

  public async getScheduleExceptionsByUser(userId: string): Promise<ScheduleExceptionDoc[]> {
    const exceptions = await ScheduleException.find({ userId });
    return exceptions;
  }

  public async createScheduleException(dto: CreateScheduleExceptionDto): Promise<ScheduleExceptionDoc> {
    const oldException = await this.scheduleExceptionExists(dto.schedule, dto.date);
    if (oldException) {
      await oldException.remove();
    }

    const exception = ScheduleException.build(dto);
    await exception.save();
    return exception;
  }

  public async editScheduleException(dto: EditScheduleExceptionDto) {
    const exception = await this.getScheduleExceptionById(dto.id);

    if (dto.date && await this.scheduleExceptionExists(exception.schedule, dto.date)) {
      throw new BadRequestError(`A schedule-exception already exists for the occurrence on ${ dto.date }.`);
    }
    
    exception.set(dto);
    await exception.save();
    return exception;
  }

  public async deleteScheduleException(id: string): Promise<ScheduleExceptionDoc> {
    const exception = await this.getScheduleExceptionById(id);
    await exception.remove();
    return exception;
  }
}

const scheduleExceptionService = new ScheduleExceptionService();
Object.freeze(scheduleExceptionService);
export { scheduleExceptionService };
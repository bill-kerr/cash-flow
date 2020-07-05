import { CreateScheduleExceptionDto } from '../models/dto/schedule-exception.dto';
import { ScheduleExceptionDoc, ScheduleException } from '../models/schedule-exception.model';
import { BadRequestError, NotAuthorizedError } from '../errors';

class ScheduleExceptionService {
  private async scheduleExceptionExists(scheduleId: string, date: string): Promise<boolean> {
    const exception = await ScheduleException.findOne({ schedule: scheduleId, date });
    return !!exception;
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
    if (await this.scheduleExceptionExists(dto.schedule, dto.date)) {
      throw new BadRequestError(`A schedule-exception already exists for the occurrence on ${ dto.date }.`);
    }

    const exception = ScheduleException.build(dto);
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
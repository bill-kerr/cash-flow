import { CreateScheduleExceptionDto } from '../models/dto/schedule-exception.dto';
import { ScheduleExceptionDoc, ScheduleException } from '../models/schedule-exception.model';

class ScheduleExceptionService {

  async createScheduleException(dto: CreateScheduleExceptionDto): Promise<ScheduleExceptionDoc> {
    const exception = ScheduleException.build(dto);
    await exception.save();
    return exception;
  }

}

const scheduleExceptionService = new ScheduleExceptionService();
Object.freeze(scheduleExceptionService);
export { scheduleExceptionService };
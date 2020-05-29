import { CreateScheduleDto } from '../models/dto/schedule.dto';
import { Schedule, ScheduleDoc } from '../models/schedule.model';
import { BadRequestError } from '../errors/bad-request-error';

class ScheduleService {

  async createSchedule(dto: CreateScheduleDto): Promise<ScheduleDoc> {
    if (dto.endDate && dto.endDate < dto.startDate) {
      throw new BadRequestError('The end date must be after the start date.');
    }

    const schdeule = Schedule.build(dto);
    await schdeule.save();

    //transactionService.createTransactionsFromSchedule(schdeule);

    return schdeule;
  }

  async getSchedules(userId: string): Promise<ScheduleDoc[]> {
    return Schedule.find({ userId });
  }

}

const scheduleService = new ScheduleService();
Object.freeze(scheduleService);
export { scheduleService };
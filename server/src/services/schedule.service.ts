import { CreateScheduleDto } from '../models/dto/schedule.dto';
import { Schedule, ScheduleDoc } from '../models/schedule.model';
import { BadRequestError } from '../errors/bad-request-error';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { occurrenceService } from '../services/occurrence.service';

class ScheduleService {

  async createSchedule(dto: CreateScheduleDto): Promise<ScheduleDoc> {
    if (dto.endDate && dto.endDate < dto.startDate) {
      throw new BadRequestError('The end date must be after the start date.');
    }

    if (dto.isRecurring) {
      const rule = occurrenceService.generateRecurrenceRule(dto);
      dto.recurrenceRule = rule;
    }
    const schedule = Schedule.build(dto);
    await schedule.save();

    //transactionService.createTransactionsFromSchedule(schedule);

    return schedule;
  }

  async getSchedules(userId: string): Promise<ScheduleDoc[]> {
    return Schedule.find({ userId });
  }

  async getScheduleById(scheduleId: string, userId: string): Promise<ScheduleDoc> {
    const schedule = await Schedule.findOne({ id: scheduleId });
    
    if (!schedule || schedule.userId !== userId) {
      throw new NotAuthorizedError('Not authorized to access this route.');
    }

    return schedule;
  }

  async getScheduleOccurences(
    scheduleId: string, 
    startDate: string, 
    endDate: string, 
    userId: string
  ) {
    const schedule = await this.getScheduleById(scheduleId, userId);
    return occurrenceService.getOccurrences(schedule, startDate, endDate);
  }

}

const scheduleService = new ScheduleService();
Object.freeze(scheduleService);
export { scheduleService };
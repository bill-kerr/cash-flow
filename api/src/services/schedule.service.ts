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
    return schedule;
  }

  async getSchedules(userId: string): Promise<ScheduleDoc[]> {
    return Schedule.find({ userId });
  }

  async getScheduleById(scheduleId: string): Promise<ScheduleDoc> {
    const schedule = await Schedule.findOne({ id: scheduleId });
    
    if (!schedule) {
      throw new NotAuthorizedError();
    }

    return schedule;
  }

  async getScheduleOccurences(
    scheduleId: string, 
    startDate: string, 
    endDate: string
  ) {
    const schedule = await this.getScheduleById(scheduleId);
    return occurrenceService.getOccurrencesBySchedule(schedule, startDate, endDate);
  }

  async deleteSchedule(scheduleId: string): Promise<ScheduleDoc> {
    const schedule = await this.getScheduleById(scheduleId);
    await schedule.remove();
    return schedule;
  }

}

const scheduleService = new ScheduleService();
Object.freeze(scheduleService);
export { scheduleService };
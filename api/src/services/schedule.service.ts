import { CreateScheduleDto, EditScheduleDto } from '../models/dto/schedule.dto';
import { Schedule, ScheduleDoc } from '../models/schedule.model';
import { BadRequestError } from '../errors/bad-request-error';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { occurrenceService } from '../services/occurrence.service';
import { scheduleExceptionService } from './schedule-exception.service';

class ScheduleService {

  private recurrenceKeys = [
    'interval',
    'dayOfWeek',
    'dayOfMonth',
    'month',
    'frequency'
  ];

  private isRecurrenceEdited(schedule: ScheduleDoc, dto: EditScheduleDto): boolean {
    const props = Object.entries(dto);
    const changedProps = props.filter(
      prop => this.recurrenceKeys.includes(prop[0]) && schedule.get(prop[0]) !== prop[1]
    );
    return changedProps.length > 0;
  }

  private resetRecurrenceFields(schedule: ScheduleDoc): ScheduleDoc {
    const keys = [...this.recurrenceKeys, 'recurrenceRule'];
    keys.map(key => {
      schedule.set(key, null);
    });

    return schedule;
  }

  async createSchedule(dto: CreateScheduleDto): Promise<ScheduleDoc> {
    if (dto.endDate && dto.endDate < dto.startDate) {
      throw new BadRequestError('The end date must occur after the start date.');
    }

    dto.recurrenceRule = occurrenceService.generateRecurrenceRule(dto);
    
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

  async editSchedule(dto: EditScheduleDto): Promise<ScheduleDoc> {
    const schedule = await this.getScheduleById(dto.id);

    if (this.isRecurrenceEdited(schedule, dto)) {
      await scheduleExceptionService.deleteScheduleExceptionsBySchedule(schedule.id);
      this.resetRecurrenceFields(schedule);
      console.log(schedule)
    }

    await schedule.updateOne(dto);
    console.log(schedule)
    return schedule;
  }

}

const scheduleService = new ScheduleService();
Object.freeze(scheduleService);
export { scheduleService };
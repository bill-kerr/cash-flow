import { CreateScheduleDto, EditScheduleDto } from '../models/dto/schedule.dto';
import { Schedule, ScheduleDoc } from '../models/schedule.model';
import { BadRequestError } from '../errors/bad-request-error';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { occurrenceService } from '../services/occurrence.service';
import { scheduleExceptionService } from './schedule-exception.service';
import { Frequency } from '../types';

class ScheduleService {

  private recurrenceKeys = [
    'interval',
    'dayOfWeek',
    'dayOfMonth',
    'month',
    'frequency',
    'startDate',
    'endDate'
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

  private removeUnnecessaryFields(dto: CreateScheduleDto): CreateScheduleDto {
    const d = { ...dto };
    switch (d.frequency) {
      case Frequency.ONCE:
        d.month = undefined;
        d.dayOfWeek = undefined;
        d.dayOfMonth = undefined;
        d.endDate = undefined;
        d.interval = undefined;
        return d;
      case Frequency.DAILY:
        d.month = undefined;
        d.dayOfMonth = undefined;
        d.dayOfWeek = undefined;
        return d;
      case Frequency.WEEKLY:
        d.dayOfMonth = undefined;
        d.month = undefined;
        return d;
      case Frequency.MONTHLY:
        d.dayOfWeek = undefined;
        d.month = undefined;
        return d;
      case Frequency.YEARLY:
        d.dayOfWeek = undefined;
        return d;
      default:
        return d;
    }
  }

  private async nullUnnecessaryFields(schedule: ScheduleDoc): Promise<ScheduleDoc> {
    switch (schedule.frequency) {
      case Frequency.ONCE:
        schedule.set({ interval: 1, month: null, dayOfWeek: null, dayOfMonth: null, endDate: null });
        await schedule.save();
        return schedule;
      case Frequency.DAILY:
        schedule.set({ month: null, dayOfWeek: null, dayOfMonth: null });
        await schedule.save();
        return schedule;
      case Frequency.WEEKLY:
        schedule.set({ month: null, dayOfMonth: null });
        await schedule.save();
        return schedule;
      case Frequency.MONTHLY:
        schedule.set({ month: null, dayOfWeek: null });
        await schedule.save();
        return schedule;
      case Frequency.YEARLY:
        schedule.set({ dayOfWeek: null });
        await schedule.save();
        return schedule;
      default:
        return schedule;
    }
  }

  async createSchedule(dto: CreateScheduleDto): Promise<ScheduleDoc> {
    dto.recurrenceRule = occurrenceService.generateRecurrenceRule(dto);
    dto = this.removeUnnecessaryFields(dto);

    if (dto.endDate && dto.endDate < dto.startDate) {
      throw new BadRequestError('The end date must occur after the start date.');
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

  async getScheduleOccurrences(
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
    }

    const updatedSchedule = await Schedule.findOneAndUpdate({ id: dto.id }, dto, { new: true });
    if (!updatedSchedule) {
      throw new NotAuthorizedError();
    }

    await this.nullUnnecessaryFields(updatedSchedule);
    updatedSchedule.set({ recurrenceRule: occurrenceService.generateRecurrenceRule(updatedSchedule) });
    return updatedSchedule;
  }

}

const scheduleService = new ScheduleService();
Object.freeze(scheduleService);
export { scheduleService };
import { CreateScheduleDto } from '../models/dto/schedule.dto';
import { Schedule, ScheduleDoc } from '../models/schedule.model';
import { BadRequestError } from '../errors/bad-request-error';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { Moment } from 'moment';
import { Occurrence } from '../models/occurrence.model';
import { RRule } from 'rrule';

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

    const rule = new RRule({
      freq: RRule.WEEKLY,
      interval: 1,
      byweekday: [RRule.MO],
      dtstart: new Date(Date.UTC(2020, 5, 5)),
      until: new Date(Date.UTC(2020, 12, 31)),
      count: 5000
    });

    console.log(rule.all());
    console.log(rule.toString());
  }

}

const scheduleService = new ScheduleService();
Object.freeze(scheduleService);
export { scheduleService };
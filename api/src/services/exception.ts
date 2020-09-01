import { CreateExceptionDto, UpdateExceptionDto } from '../types';
import { Exception, Schedule } from '../entities';
import { NotFoundError } from '../errors';
import { Repository } from 'typeorm';
import { IExceptionService, IScheduleService } from '../interfaces';

export class ExceptionService implements IExceptionService {
  constructor(private scheduleService: IScheduleService, private repository: Repository<Exception>) {}

  public async getExceptionById(exceptionId: string, userId: string, loadSchedule = false): Promise<Exception> {
    const relations = loadSchedule ? ['schedule'] : [];
    const exception = await this.repository.findOne({ where: { id: exceptionId, userId }, relations });
    if (!exception) {
      throw new NotFoundError();
    }

    return exception;
  }

  public async getExceptionByScheduleAndDate(schedule: Schedule, date: string): Promise<Exception | undefined> {
    const exception = await this.repository.findOne({ schedule, date });
    if (!exception) {
      throw new NotFoundError();
    }

    return exception;
  }

  public getExceptionsBySchedule(schedule: Schedule): Promise<Exception[]> {
    return this.repository.find({ schedule });
  }

  public getExceptionsByUser(userId: string): Promise<Exception[]> {
    return this.repository.find({ userId });
  }

  public async createException(dto: CreateExceptionDto): Promise<Exception> {
    const schedule = await this.scheduleService.getScheduleById(dto.schedule, dto.userId);
    const oldException = await this.repository.findOne({ date: dto.date, schedule });
    if (oldException) {
      await oldException.remove();
    }

    if (!dto.currentDate) {
      dto.currentDate = dto.date;
    }

    return this.repository.create({ ...dto, schedule }).save();
  }

  public async updateException(dto: UpdateExceptionDto): Promise<Exception> {
    const exception = await this.getExceptionById(dto.id, dto.userId, true);
    return this.repository.merge(exception, dto).save();
  }

  public async deleteException(exceptionId: string, userId: string): Promise<Exception> {
    const exception = await this.getExceptionById(exceptionId, userId);
    return exception.remove();
  }
}

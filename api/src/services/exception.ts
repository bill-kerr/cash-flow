import { CreateExceptionDto, UpdateExceptionDto } from "../types";
import { Exception, Schedule } from "../entities";
import { BadRequestError, NotFoundError } from "../errors";
import { Repository } from "typeorm";
import { IExceptionService, IScheduleService } from "../interfaces";

export class ExceptionService implements IExceptionService {
  constructor(private scheduleService: IScheduleService, private repository: Repository<Exception>) {}

  public async getExceptionById(exceptionId: string, userId: string, loadSchedule = false): Promise<Exception> {
    const relations = loadSchedule ? ["schedule"] : [];
    const exception = await this.repository.findOne({ where: { id: exceptionId, userId }, relations });
    if (!exception) {
      throw new NotFoundError();
    }

    return exception;
  }

  public async getExceptionByScheduleAndDate(schedule: Schedule, date: string): Promise<Exception | undefined> {
    const exception = await this.repository.findOne({ scheduleDoc: schedule, date });
    if (!exception) {
      throw new NotFoundError();
    }

    return exception;
  }

  public getExceptionsBySchedule(schedule: Schedule): Promise<Exception[]> {
    return this.repository.find({ scheduleDoc: schedule });
  }

  public getExceptionsByUser(userId: string): Promise<Exception[]> {
    return this.repository.find({ userId });
  }

  public async createException(dto: CreateExceptionDto): Promise<Exception> {
    const schedule = await this.scheduleService.getScheduleById(dto.schedule, dto.userId);
    const oldException = await this.repository.findOne({ date: dto.date, scheduleDoc: schedule });
    if (oldException) {
      await oldException.remove();
    }

    return this.repository.create({ ...dto, scheduleDoc: schedule }).save();
  }

  public async updateException(dto: UpdateExceptionDto): Promise<Exception> {
    const exception = await this.getExceptionById(dto.id, dto.userId, true);

    if (dto.date && (await this.getExceptionByScheduleAndDate(exception.scheduleDoc, dto.date))) {
      throw new BadRequestError(`An exception already exists for the occurrence on ${dto.date}.`);
    }

    return this.repository.merge(exception, dto).save();
  }

  public async deleteException(exceptionId: string, userId: string): Promise<Exception> {
    const exception = await this.getExceptionById(exceptionId, userId);
    return exception.remove();
  }
}

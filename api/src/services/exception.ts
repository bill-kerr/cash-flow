import { CreateExceptionDto, UpdateExceptionDto } from "../types";
import { Exception } from "../entities";
import { BadRequestError, NotAuthorizedError } from "../errors";
import { Repository } from "typeorm";
import { ScheduleService } from "./schedule";

export class ExceptionService {
  constructor(private scheduleService: ScheduleService, private repository: Repository<Exception>) {}

  public async getExceptionById(id: string): Promise<Exception> {
    const exception = await Exception.findOne({ id });
    if (!exception) {
      throw new NotAuthorizedError();
    }

    return exception;
  }

  public async getExceptionByScheduleAndDate(scheduleId: string, date: string): Promise<Exception | undefined> {
    const schedule = await this.scheduleService.getScheduleById(scheduleId);
    console.log(scheduleId, schedule.exceptions);

    if (!schedule.exceptions) {
      return;
    }

    return schedule.exceptions.find((exception) => exception.date === date);
  }

  public async getExceptionsByScheduleId(scheduleId: string): Promise<Exception[]> {
    const schedule = await this.scheduleService.getScheduleById(scheduleId);
    return schedule.exceptions ? schedule.exceptions : [];
  }

  public async getExceptionsByUser(userId: string): Promise<Exception[]> {
    const exceptions = await Exception.find({ userId });
    return exceptions ? exceptions : [];
  }

  public async createException(dto: CreateExceptionDto): Promise<Exception> {
    const oldException = await this.getExceptionByScheduleAndDate(dto.scheduleId, dto.date);
    console.log(oldException);
    if (oldException) {
      await oldException.remove();
    }

    const exception = Exception.create(dto);
    await exception.save();
    return exception;
  }

  public async updateException(dto: UpdateExceptionDto) {
    const exception = await this.getExceptionById(dto.id);

    if (dto.date && (await this.getExceptionByScheduleAndDate(exception.schedule.id, dto.date))) {
      throw new BadRequestError(`An exception already exists for the occurrence on ${dto.date}.`);
    }

    exception.update(dto);
    await exception.save();
    return exception;
  }

  public async deleteException(id: string): Promise<Exception> {
    const exception = await this.getExceptionById(id);
    await exception.remove();

    // TODO: delete this
    this.repository.count();

    return exception;
  }
}

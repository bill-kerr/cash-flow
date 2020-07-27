import { CreateExceptionDto, UpdateExceptionDto } from "../types";
import { Exception } from "../entities";
import { BadRequestError, NotAuthorizedError } from "../errors";

class ExceptionService {
  public async getExceptionById(id: string): Promise<Exception> {
    const exception = await Exception.findOne({ id });
    if (!exception) {
      throw new NotAuthorizedError();
    }

    return exception;
  }

  public getExceptionByScheduleAndDate(scheduleId: string, date: string): Promise<Exception | undefined> {
    return Exception.findOne({ scheduleId, date });
  }

  public getExceptionsBySchedule(scheduleId: string): Promise<Exception[]> {
    return Exception.find({ scheduleId });
  }

  public async getExceptionsByUser(userId: string): Promise<Exception[]> {
    const exceptions = await Exception.find({ userId });
    return exceptions;
  }

  public async createException(dto: CreateExceptionDto): Promise<Exception> {
    const oldException = await this.getExceptionByScheduleAndDate(dto.scheduleId, dto.date);
    if (oldException) {
      await oldException.remove();
    }

    const exception = Exception.create(dto);
    await exception.save();
    return exception;
  }

  public async updateException(dto: UpdateExceptionDto) {
    const exception = await this.getExceptionById(dto.id);

    if (dto.date && (await this.getExceptionByScheduleAndDate(exception.scheduleId, dto.date))) {
      throw new BadRequestError(`An exception already exists for the occurrence on ${dto.date}.`);
    }

    await Exception.update(exception, dto);
    return exception;
  }

  public async deleteException(id: string): Promise<Exception> {
    const exception = await this.getExceptionById(id);
    await exception.remove();
    return exception;
  }
}

const exceptionService = new ExceptionService();
Object.freeze(exceptionService);
export { exceptionService };

import { CreateExceptionDto, EditExceptionDto } from "../types";
import { ExceptionDoc, Exception } from "../models";
import { BadRequestError, NotAuthorizedError } from "../errors";

class ExceptionService {
  private async exceptionExists(scheduleId: string, date: string): Promise<ExceptionDoc | null> {
    const exception = await Exception.findOne({ schedule: scheduleId, date });
    return exception;
  }

  public async getExceptionById(id: string): Promise<ExceptionDoc> {
    const exception = await Exception.findOne({ id });
    if (!exception) {
      throw new NotAuthorizedError();
    }

    return exception;
  }

  public async getExceptionsBySchedule(scheduleId: string): Promise<ExceptionDoc[]> {
    const exceptions = await Exception.find({ schedule: scheduleId });
    return exceptions;
  }

  public async getExceptionsByUser(userId: string): Promise<ExceptionDoc[]> {
    const exceptions = await Exception.find({ userId });
    return exceptions;
  }

  public async createException(dto: CreateExceptionDto): Promise<ExceptionDoc> {
    const oldException = await this.exceptionExists(dto.schedule, dto.date);
    if (oldException) {
      await oldException.remove();
    }

    const exception = Exception.build(dto);
    await exception.save();
    return exception;
  }

  public async editException(dto: EditExceptionDto) {
    const exception = await this.getExceptionById(dto.id);

    if (dto.date && (await this.exceptionExists(exception.schedule, dto.date))) {
      throw new BadRequestError(`An exception already exists for the occurrence on ${dto.date}.`);
    }

    exception.set(dto);
    await exception.save();
    return exception;
  }

  public async deleteException(id: string): Promise<ExceptionDoc> {
    const exception = await this.getExceptionById(id);
    await exception.remove();
    return exception;
  }
}

const exceptionService = new ExceptionService();
Object.freeze(exceptionService);
export { exceptionService };

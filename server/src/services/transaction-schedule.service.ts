import { CreateTransactionScheduleDto } from '../models/dto/transaction-schedule.dto';
import { TransactionSchedule, TransactionScheduleRepository } from '../models/transaction-schedule.model';
import { BadRequestError } from '../errors/bad-request-error';
import { transactionService } from './transaction.service';

class TransactionScheduleService {

  async createTransactionSchedule(dto: CreateTransactionScheduleDto): Promise<TransactionSchedule> {
    if (dto.endDate && dto.endDate < dto.startDate) {
      throw new BadRequestError('The end date must be after the start date.');
    }

    const transactionSchedule = TransactionScheduleRepository.build(dto);
    await transactionSchedule.save();

    transactionService.createTransactionsFromSchedule(transactionSchedule);

    return transactionSchedule;
  }

  async getTransactionSchedules(userId: string): Promise<TransactionSchedule[]> {
    return TransactionScheduleRepository.find({ userId });
  }

}

const transactionScheduleService = new TransactionScheduleService();
Object.freeze(transactionScheduleService);
export { transactionScheduleService };
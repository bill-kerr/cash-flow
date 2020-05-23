import { CreateTransactionScheduleDto } from '../models/dto/transaction-schedule.dto';
import { TransactionSchedule, TransactionScheduleRepository } from '../models/transaction-schedule.model';

class TransactionScheduleService {

  async createTransactionSchedule(dto: CreateTransactionScheduleDto): Promise<TransactionSchedule> {
    const transactionSchedule = TransactionScheduleRepository.build(dto);
    await transactionSchedule.save();
    return transactionSchedule;
  }

}

const transactionScheduleService = new TransactionScheduleService();
Object.freeze(transactionScheduleService);
export { transactionScheduleService };
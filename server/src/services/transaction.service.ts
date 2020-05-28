import later from 'later';
import moment from 'moment';
import { CreateTransactionDto } from '../models/dto/transaction.dto';
import { Transaction, TransactionRepository } from '../models/transaction.model';
import { TransactionSchedule } from '../models/transaction-schedule.model';

class TransactionService {
  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = TransactionRepository.build(dto);
    await transaction.save();
    return transaction;
  }

  async createTransactionsFromSchedule(schedule: TransactionSchedule) {
    const occurences = later.schedule({
      schedules: [{ D: [0] }]
    }).next(365, moment().toDate(), moment('2022-05-25').toDate());

    console.log(occurences);
  }
}

const transactionService = new TransactionService();
Object.freeze(transactionService);
export { transactionService };
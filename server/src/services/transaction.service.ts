import { CreateTransactionDto } from '../models/dto/transaction.dto';
import { Transaction, TransactionRepository } from '../models/transaction.model';


class TransactionService {
  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = TransactionRepository.build(dto);
    await transaction.save();
    return transaction;
  }
}

const transactionService = new TransactionService();
Object.freeze(transactionService);
export { transactionService };
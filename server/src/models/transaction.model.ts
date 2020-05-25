import mongoose from 'mongoose';
import { Moment } from 'moment';
import { CreateTransactionDto } from './dto/transaction.dto';

interface Transaction extends mongoose.Document {
  date: Moment,
  amount: number,
  description: string,
  transactionSchedule: string,
}

interface TransactionModel extends mongoose.Model<Transaction> {
  build(createTransactionDto: CreateTransactionDto): Transaction;
}

const transactionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  transactionSchedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransactionSchedule'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      const id = ret._id;
      delete ret._id;
      delete ret.__v;
      return { id, object: 'transaction', ...ret };
    }
  }
});

transactionSchema.statics.build = (dto: CreateTransactionDto) => {
  return new TransactionRepository(dto);
}

const TransactionRepository = mongoose.model<Transaction, TransactionModel>
  ('transaction', transactionSchema);

export { Transaction, TransactionRepository };
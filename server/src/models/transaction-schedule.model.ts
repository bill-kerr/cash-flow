import mongoose from 'mongoose';
import { Moment } from 'moment';

import { CreateTransactionScheduleDto } from './dto/transaction-schedule.dto';

interface TransactionSchedule extends mongoose.Document {
  id: string;
  amount: string;
  description: string;
  startDate: Moment;
  endDate: Moment;
  userId: string;
}

interface TransactionScheduleModel extends mongoose.Model<TransactionSchedule> {
  build(createTransactionScheduleDto: CreateTransactionScheduleDto): TransactionSchedule;
}

const transactionScheduleSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isRecurring: {
    type: Boolean,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: false
  },
  userId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc: any, ret: any) {
      const id = ret._id;
      delete ret._id;
      delete ret.__v;
      return { id, object: 'transaction-schedule', ...ret };
    }
  }
});

transactionScheduleSchema.statics.build = (dto: CreateTransactionScheduleDto) => {
  return new TransactionScheduleRepository(dto);
}

const TransactionScheduleRepository = mongoose.model<TransactionSchedule, TransactionScheduleModel>
  ('TransactionSchedule', transactionScheduleSchema);

export { TransactionSchedule, TransactionScheduleRepository };
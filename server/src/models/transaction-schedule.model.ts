import mongoose from 'mongoose';
import { Moment } from 'moment';
import { CreateTransactionScheduleDto } from './dto/transaction-schedule.dto';
import { Frequency, DayOfWeek, Month } from '../types';

interface TransactionSchedule extends mongoose.Document {
  id: string;
  amount: string;
  description: string;
  startDate: Moment;
  endDate?: Moment;
  frequency?: Frequency;
  separation?: number;
  dayOfWeek?: DayOfWeek;
  dayOfMonth?: number;
  month?: Month;
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
  frequency: {
    type: String,
    required: false
  },
  separation: {
    type: Number,
    required: false,
    default: null
  },
  dayOfWeek: {
    type: String,
    required: false,
    default: null
  },
  dayOfMonth: {
    type: String,
    required: false,
    default: null
  },
  month: {
    type: String,
    required: false,
    default: null
  },
  userId: {
    type: String,
    required: true,
    default: null
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
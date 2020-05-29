import mongoose from 'mongoose';
import { Moment } from 'moment';
import { CreateScheduleExceptionDto } from './dto/schedule-exception.dto';

interface ScheduleExceptionDoc extends mongoose.Document {
  deleted: boolean;
  date: Moment;
  amount: number;
  description: string;
  schedule: string;
}

interface ScheduleExceptionModel extends mongoose.Model<ScheduleExceptionDoc> {
  build(dto: CreateScheduleExceptionDto): ScheduleExceptionDoc;
}

const scheduleExceptionSchema = new mongoose.Schema({
  deleted: {
    type: Boolean,
    required: true
  },
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
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      const id = ret._id;
      delete ret._id;
      delete ret.__v;
      return { id, object: 'schedule-exception', ...ret };
    }
  }
});

scheduleExceptionSchema.statics.build = (dto: CreateScheduleExceptionDto) => {
  return new ScheduleException(dto);
}

const ScheduleException = mongoose.model<ScheduleExceptionDoc, ScheduleExceptionModel>
  ('ScheduleException', scheduleExceptionSchema);

export { ScheduleException, ScheduleExceptionDoc };
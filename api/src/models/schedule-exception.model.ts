import mongoose from 'mongoose';
import { CreateScheduleExceptionDto } from '../types';

interface ScheduleExceptionDoc extends mongoose.Document {
  id: string;
  date: string;
  occurrenceDeleted: boolean;
  currentDate: string | null;
  amount: number | null;
  description: string | null;
  schedule: string;
  userId: string;
}

interface ScheduleExceptionModel extends mongoose.Model<ScheduleExceptionDoc> {
  build(dto: CreateScheduleExceptionDto): ScheduleExceptionDoc;
}

const scheduleExceptionSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  occurrenceDeleted: {
    type: Boolean,
    default: false
  },
  currentDate: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  },
  userId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc: any, ret: any) {
      delete ret._id;
      delete ret.__v;
      return { object: 'schedule-exception', id: ret.id, ...ret };
    }
  }
});

scheduleExceptionSchema.statics.build = (dto: CreateScheduleExceptionDto) => {
  dto.id = mongoose.Types.ObjectId().toHexString();
  return new ScheduleException(dto);
};

const ScheduleException = mongoose.model<ScheduleExceptionDoc, ScheduleExceptionModel>
  ('ScheduleException', scheduleExceptionSchema);

export { ScheduleException, ScheduleExceptionDoc };
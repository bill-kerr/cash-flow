import mongoose from 'mongoose';
import { CreateScheduleExceptionDto } from './dto/schedule-exception.dto';
import { Occurrence } from './occurrence.model';

interface ScheduleExceptionDoc extends mongoose.Document {
  date: string;
  deleted: boolean;
  amount: number;
  description: string;
  schedule: string;
  userId: string;
  createOccurrence(scheduleId: string, date: string): Occurrence;
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
  deleted: {
    type: Boolean,
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
}

scheduleExceptionSchema.methods.createOccurrence = function (scheduleId: string, date: string): Occurrence {
  return {
    object: 'occurrence',
    date,
    amount: this.amount,
    description: this.description,
    schedule: scheduleId
  };
};

const ScheduleException = mongoose.model<ScheduleExceptionDoc, ScheduleExceptionModel>
  ('ScheduleException', scheduleExceptionSchema);

export { ScheduleException, ScheduleExceptionDoc };
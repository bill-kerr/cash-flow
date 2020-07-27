import mongoose from "mongoose";
import { CreateExceptionDto } from "../types";

interface ExceptionDoc extends mongoose.Document {
  id: string;
  date: string;
  occurrenceDeleted: boolean;
  currentDate: string | null;
  amount: number | null;
  description: string | null;
  schedule: string;
  userId: string;
}

interface ExceptionModel extends mongoose.Model<ExceptionDoc> {
  build(dto: CreateExceptionDto): ExceptionDoc;
}

const exceptionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    occurrenceDeleted: {
      type: Boolean,
      default: false,
    },
    currentDate: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
        delete ret._id;
        delete ret.__v;
        return { object: "exception", id: ret.id, ...ret };
      },
    },
  }
);

exceptionSchema.statics.build = (dto: CreateExceptionDto) => {
  dto.id = mongoose.Types.ObjectId().toHexString();
  return new Exception(dto);
};

const Exception = mongoose.model<ExceptionDoc, ExceptionModel>("Exception", exceptionSchema);

export { Exception, ExceptionDoc };

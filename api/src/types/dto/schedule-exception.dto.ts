export interface CreateScheduleExceptionDto {
  date: string;
  occurrenceDeleted?: boolean;
  currentDate?: string;
  amount?: number;
  description?: string;
  id?: string;
  userId: string;
  schedule: string;
}

export interface EditScheduleExceptionDto {
  id: string;
  date?: string;
  occurrenceDeleted?: boolean;
  currentDate?: string;
  amount?: number;
  description?: string;
}
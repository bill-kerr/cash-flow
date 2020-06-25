export interface CreateScheduleExceptionDto {
  id: string;
  date: string;
  occurrenceDeleted?: boolean;
  amount?: number;
  description?: string;
  schedule: string;
  userId: string;
}
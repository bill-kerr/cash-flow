export interface CreateScheduleExceptionDto {
  date: string;
  occurrenceDeleted?: boolean;
  currentDate?: string;
  amount?: number;
  description?: string;
  id: string;
  userId: string;
  scheduleId: string;
}
export interface CreateScheduleExceptionDto {
  id: string;
  currentDate: string;
  date: string;
  deleted: boolean;
  amount: number;
  description: string;
  schedule: string;
}
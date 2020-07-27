export interface CreateExceptionDto {
  date: string;
  occurrenceDeleted?: boolean;
  currentDate?: string;
  amount?: number;
  description?: string;
  id?: string;
  userId: string;
  schedule: string;
}

export interface EditExceptionDto {
  id: string;
  date?: string;
  occurrenceDeleted?: boolean;
  currentDate?: string;
  amount?: number;
  description?: string;
}

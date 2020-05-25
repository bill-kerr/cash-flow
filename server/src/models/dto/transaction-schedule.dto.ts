interface CreateTransactionScheduleDto {
  id: string;
  amount: number;
  description: string;
  recurring: boolean;
  startDate: string;
  endDate?: string;
  userId: string;
}

export { CreateTransactionScheduleDto };
interface CreateTransactionScheduleDto {
  id: string;
  amount: number;
  description: string;
  startDate: string;
  endDate?: string;
  userId: string;
}

export { CreateTransactionScheduleDto };
export type Expense = {
  id: string;
  title: string;
  amount: number;
};

export type RootStackParamList = {
  ExpenseList: undefined;
  ExpenseDetail: { id: string };
  AddExpense: { expense?: Expense };
};

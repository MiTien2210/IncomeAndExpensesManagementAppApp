export type Expense = {
  id: string;
  title: string;
  amount: number;
  date: string;
  // category: string;
};

export type RootStackParamList = {
  ExpenseList: undefined;
  ExpenseDetail: { id: string };
  AddExpense: { expense?: Expense };
  ExpenseStatistics: undefined; 
};



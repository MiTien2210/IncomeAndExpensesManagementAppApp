
export type RootStackParamList = {
  ExpenseList: undefined;
  AddExpense: undefined;
  ExpenseDetail: { id: string }
};

export interface Expense {
  id: string;
  title: string;
  amount: number;
}
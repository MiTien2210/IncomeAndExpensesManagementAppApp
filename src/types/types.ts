export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: any;
  note ?: string;
  date: string;
}

export type ParamList = {
  Tabs: undefined;
  TransactionDetail: {transaction: Transaction};
  TransactionListByCategory: {
    categoryName: string;
    type: 'income' | 'expense';
    isParent: boolean;
  };
  EditTransaction: {transaction: Transaction};
};

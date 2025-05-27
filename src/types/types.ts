import { NavigatorScreenParams } from '@react-navigation/native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: any;
  note?: string;
  date: string;
}

export type User = FirebaseAuthTypes.User;

export type TabParamList = {
  'Tổng quan': undefined;
  'Sổ giao dịch': undefined;
  'Ghi chép giao dịch': undefined;
};

export type ParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: NavigatorScreenParams<TabParamList>;
  TransactionList: undefined;
  TransactionDetail: { transaction: Transaction, isAdd?: boolean };
  TransactionListByCategory: {
    categoryName: string;
    type: 'income' | 'expense';
    isParent: boolean;
  };
  EditTransaction: { transaction: Transaction };
};


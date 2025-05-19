import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/types';

export interface Category {
  text: string;     // Tên danh mục con
  type: string;     // Danh mục cha: 'income' hoặc 'expense'
  color: string;
  typeColor: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (updated: Transaction) => void;
  deleteTransaction: (id: string) => void;
  loadTransactions: () => Promise<void>;  // Thêm hàm loadTransactions
}

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  setTransactions: () => {},
  addTransaction: () => {},
  updateTransaction: () => {},
  deleteTransaction: () => {},
  loadTransactions: async () => {},  // hàm mặc định
});

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Hàm loadTransactions để tải dữ liệu từ AsyncStorage
  const loadTransactions = async () => {
    try {
      const stored = await AsyncStorage.getItem('transactions');
      if (stored) {
        const parsed = JSON.parse(stored);
        setTransactions(parsed);
      }
    } catch (error) {
      console.error('Lỗi khi đọc giao dịch từ AsyncStorage:', error);
    }
  };

  // Khi mount, gọi loadTransactions lần đầu
  useEffect(() => {
    loadTransactions();
  }, []);

  // Mỗi khi transactions thay đổi, lưu lại AsyncStorage
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
      } catch (error) {
        console.error('Lỗi khi lưu giao dịch vào AsyncStorage:', error);
      }
    };

    saveTransactions();
  }, [transactions]);

  // Thêm giao dịch
  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  // Cập nhật giao dịch
  const updateTransaction = (updated: Transaction) => {
    setTransactions(prev =>
      prev.map(t => (t.id === updated.id ? updated : t))
    );
  };

  // Xóa giao dịch
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        loadTransactions,  // Đưa hàm loadTransactions vào context
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

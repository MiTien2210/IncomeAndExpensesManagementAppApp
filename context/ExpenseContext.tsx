import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../types';

// Định nghĩa kiểu cho context
type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (title: string, amount: number) => void;
  updateExpense: (id: string, title: string, amount: number) => void;
  deleteExpense: (id: string) => void;
};

// Định nghĩa kiểu cho props của ExpenseProvider
type ExpenseProviderProps = {
  children: ReactNode;
};

export const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// ExpenseProvider Component
export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Hàm lưu dữ liệu vào AsyncStorage
  const saveExpensesToStorage = async (expenses: Expense[]): Promise<void> => {
    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error("Failed to save expenses to storage:", error);
    }
  };

  // Hàm tải dữ liệu từ AsyncStorage
  const loadExpensesFromStorage = async (): Promise<void> => {
    try {
      const savedExpenses = await AsyncStorage.getItem('expenses');
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
    } catch (error) {
      console.error("Failed to load expenses from storage:", error);
    }
  };

  // Tải danh sách chi tiêu khi ứng dụng khởi động
  useEffect(() => {
    loadExpensesFromStorage();
  }, []);

  // Thêm chi tiêu mới và lưu vào AsyncStorage
  const addExpense = (title: string, amount: number): void => {
    const newExpense: Expense = {
      id: new Date().toString(), // Hoặc bạn có thể sử dụng cách tạo ID riêng
      title,
      amount,
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveExpensesToStorage(updatedExpenses);
  };

  // Cập nhật chi tiêu và lưu lại
  const updateExpense = (id: string, title: string, amount: number): void => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, title, amount } : expense
    );
    setExpenses(updatedExpenses);
    saveExpensesToStorage(updatedExpenses);
  };

  // Xóa chi tiêu và lưu lại
  const deleteExpense = (id: string): void => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    saveExpensesToStorage(updatedExpenses);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../types';

type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (title: string, amount: number) => void;
  deleteExpense: (id: string) => void;
};

export const ExpenseContext = createContext<ExpenseContextType>({
  expenses: [],
  addExpense: () => {},
  deleteExpense: () => {},
});

const STORAGE_KEY = 'expenses_data';

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load từ AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setExpenses(JSON.parse(jsonValue));
      }
    };
    loadData();
  }, []);

  // Lưu vào AsyncStorage mỗi khi expenses đổi
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (title: string, amount: number) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      title,
      amount,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

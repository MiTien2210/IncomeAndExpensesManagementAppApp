import React, { createContext, useState, ReactNode } from 'react';

export type Expense = {
  id: string;
  title: string;
  amount: number;
};

type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (title: string, amount: number) => void;
};

export const ExpenseContext = createContext<ExpenseContextType>({
  expenses: [],
  addExpense: () => {},
});

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addExpense = (title: string, amount: number) => {
    const newExpense: Expense = {
      id: Date.now().toString(), // dùng timestamp làm id đơn giản
      title,
      amount,
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
}

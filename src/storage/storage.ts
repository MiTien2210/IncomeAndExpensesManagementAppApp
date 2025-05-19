import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/types';

const STORAGE_KEY = 'transactions';

export const saveTransactions = async (transactions: Transaction[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const resetTransactions = async () => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
};

export const updateTransaction = async (updated: Transaction): Promise<void> => {
  const stored = await AsyncStorage.getItem('transactions');
  const transactions: Transaction[] = stored ? JSON.parse(stored) : [];

  const newList = transactions.map(t =>
    t.id === updated.id ? updated : t
  );

  await AsyncStorage.setItem('transactions', JSON.stringify(newList));
};

export const deleteTransaction = async (id: string) => {
  const transactions = await getTransactions();
  const updated = transactions.filter(t => t.id !== id);
  await saveTransactions(updated);
};

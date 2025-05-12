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
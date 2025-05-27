import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';

import firestore from '@react-native-firebase/firestore';

import { Transaction } from '../types/types';
import { UserContext } from './UserContext';

export interface Category {
  text: string;
  type: string;
  color: string;
  typeColor: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (updated: Transaction) => void;
  deleteTransaction: (id: string) => void;
  loadTransactions: () => Promise<void>;
}

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  setTransactions: () => { },
  addTransaction: () => { },
  updateTransaction: () => { },
  deleteTransaction: () => { },
  loadTransactions: async () => { },
});

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user } = useContext(UserContext);

  // ✅ Realtime listener khi user thay đổi
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('transactions')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(docSnap => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as Transaction[];

        setTransactions(data);
      }, error => {
        console.error('Lỗi realtime Firestore:', error);
      });

    return () => unsubscribe();
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;

    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('transactions')
        .orderBy('createdAt', 'desc')
        .get();

      const data = snapshot.docs.map(docSnap => ({
        ...docSnap.data(),
        id: docSnap.id,
      })) as Transaction[];

      setTransactions(data);
    } catch (error) {
      console.error('Lỗi khi load giao dịch từ Firestore:', error);
    }
  };

  const addTransaction = async (transaction: Transaction) => {
    try {
      if (!user) return;

      const now = new Date(); // ✅ Timestamp thủ công

      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('transactions')
        .add({
          ...transaction,
          createdAt: now,
        });

      // ❌ Không cần gọi lại loadTransactions vì đã có realtime
    } catch (error) {
      console.error('Lỗi khi thêm giao dịch:', error);
    }
  };

  const updateTransaction = async (updated: Transaction) => {
    try {
      if (!user || !updated.id) return;

      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('transactions')
        .doc(updated.id)
        .update(updated);

      // ❌ Không cần cập nhật thủ công – realtime sẽ tự xử lý
    } catch (error) {
      console.error('Lỗi khi cập nhật giao dịch:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      if (!user) return;

      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('transactions')
        .doc(id)
        .delete();

      // ❌ Không cần cập nhật thủ công – realtime sẽ tự xử lý
    } catch (error) {
      console.error('Lỗi khi xóa giao dịch:', error);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        loadTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

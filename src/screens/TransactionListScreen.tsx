import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Transaction } from '../types/types';
import { getTransactions } from '../storage/storage';
import TransactionItem from '../components/TransactionItem';

const TransactionListScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getTransactions();
      setTransactions(data);
    };
    load();
  }, []);

  return (
    <FlatList
      data={transactions}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
    />
  );
};

export default TransactionListScreen;
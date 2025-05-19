import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types/types';

interface Props {
  transaction: Transaction;
}

const TransactionItem = ({ transaction }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.note}>{transaction.note}</Text>
        <Text style={styles.date}>{transaction.date}</Text>
      </View>
      <View style={styles.right}>
        <Text
          style={[
            styles.amount,
            transaction.type === 'income' ? styles.income : styles.expense,
          ]}
        >
          {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'column',
  },
  note: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  right: {
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  income: {
    color: 'green',
  },
  expense: {
    color: 'red',
  },
});

export default TransactionItem;

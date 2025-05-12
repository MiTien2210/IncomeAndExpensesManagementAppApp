import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types/types';

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.category}>{transaction.category}</Text>
      <Text style={{ color: transaction.type === 'income' ? 'green' : 'red' }}>
        {transaction.type === 'income' ? '+' : '-'}{transaction.amount}₫
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#ccc'
  },
  category: {
    fontWeight: 'bold'
  }
});

export default TransactionItem;

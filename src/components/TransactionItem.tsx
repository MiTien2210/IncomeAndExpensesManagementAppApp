import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types/types';
import moment from 'moment';
import { formatCurrency } from '../helpers/helpers';
interface Props {
  transaction: Transaction;
}

const TransactionItem = ({ transaction }: Props) => {
  const dayShow = moment(transaction.date).format("YYYY-MM-DD h:mm:ss")
  const amout = Number(transaction.amount);
  console.log("transaction:::", transaction);
 

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.note}>{transaction.note}</Text>
        <Text style={{...styles.categoryText, color:transaction.category.color}}>{transaction.category.text}</Text>
        <Text style={styles.date}>{dayShow}</Text>
      </View>
      <View style={styles.right}>
        <Text
          style={[
            styles.amount,
            transaction.type === 'income' ? styles.income : styles.expense,
          ]}
        >
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(amout)}
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
  categoryText: {
    fontSize: 16,
    fontWeight: '400',
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

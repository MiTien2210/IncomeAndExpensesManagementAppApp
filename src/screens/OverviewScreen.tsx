import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types/types';
import { getTransactions } from '../storage/storage';

const OverviewScreen = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const load = async () => {
      const data = await getTransactions();
      const incomeTotal = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenseTotal = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      setIncome(incomeTotal);
      setExpense(expenseTotal);
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tổng thu: {income}₫</Text>
      <Text style={styles.text}>Tổng chi: {expense}₫</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  text: { fontSize: 18, marginVertical: 8 }
});

export default OverviewScreen;
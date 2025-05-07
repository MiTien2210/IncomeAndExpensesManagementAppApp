import React, { useContext } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { ExpenseContext } from '../context/ExpenseContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ExpenseList'>;
};

export default function ExpenseListScreen({ navigation }: Props) {
  const { expenses } = useContext(ExpenseContext);

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Expense List</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        Total: {totalAmount}k
      </Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={`${item.title} - ${item.amount}k`}
            onPress={() => navigation.navigate('ExpenseDetail', { id: item.id })}
          />
        )}
        ListEmptyComponent={<Text>No expenses yet.</Text>}
      />
      <Button
        title="Add Expense"
        onPress={() => navigation.navigate('AddExpense')}
      />
    </View>
  );
}

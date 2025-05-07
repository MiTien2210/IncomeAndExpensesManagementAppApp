import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ExpenseContext } from '../context/ExpenseContext';

type ExpenseDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExpenseDetail'>;
type ExpenseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExpenseDetail'>;

type Props = {
  navigation: ExpenseDetailScreenNavigationProp;
  route: ExpenseDetailScreenRouteProp;
};

export default function ExpenseDetailScreen({ navigation, route }: Props) {
  const context = useContext(ExpenseContext);

  // Kiểm tra nếu context không tồn tại hoặc không có expenses
  if (!context) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Error: Expense context is not available.</Text>
      </View>
    );
  }

  const { expenses, updateExpense } = context;
  const expense = expenses.find((e) => e.id === route.params.id);

  if (!expense) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Expense not found.</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleEdit = () => {
    // Chuyển tới màn hình AddExpense để chỉnh sửa
    navigation.navigate('AddExpense', { expense });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Expense Detail</Text>
      <Text>Title: {expense.title}</Text>
      <Text>Amount: {expense.amount}k</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      {/* Nút sửa */}
      <Button title="Edit" onPress={handleEdit} />
    </View>
  );
}
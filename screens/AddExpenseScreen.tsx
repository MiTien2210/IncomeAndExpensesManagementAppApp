import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Expense } from '../types';
import { ExpenseContext } from '../context/ExpenseContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddExpense'>;
  route: { params: { expense?: Expense } };  // Thêm tham số expense nếu đang sửa
};

export default function AddExpenseScreen({ navigation, route }: Props) {
  const context = useContext(ExpenseContext);

  // Kiểm tra nếu context không tồn tại
  if (!context) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Error: Expense context is not available.</Text>
      </View>
    );
  }

  const { addExpense, updateExpense } = context;
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  // Kiểm tra nếu có thông tin chi tiêu (expense) để sửa
  useEffect(() => {
    if (route.params?.expense) {
      setTitle(route.params.expense.title);
      setAmount(route.params.expense.amount.toString());
    }
  }, [route.params?.expense]);

  const handleSave = () => {
    const numAmount = parseInt(amount);
    if (!title || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid input', 'Please enter valid title and amount');
      return;
    }

    // Nếu có expense (đang sửa), gọi updateExpense, nếu không gọi addExpense
    if (route.params?.expense) {
      updateExpense(route.params.expense.id, title, numAmount);
    } else {
      addExpense(title, numAmount);
    }

    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>
        {route.params?.expense ? 'Edit Expense' : 'Add Expense'}
      </Text>

      <Text>Title</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., Coffee"
      />

      <Text>Amount (k)</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        value={amount}
        onChangeText={setAmount}
        placeholder="e.g., 30"
        keyboardType="numeric"
      />

      <Button title={route.params?.expense ? 'Save Changes' : 'Save Expense'} onPress={handleSave} />
    </View>
  );
}

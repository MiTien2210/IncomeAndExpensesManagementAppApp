import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { ExpenseContext } from '../context/ExpenseContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddExpense'>;
};

export default function AddExpenseScreen({ navigation }: Props) {
  const { addExpense } = useContext(ExpenseContext);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    const numAmount = parseInt(amount);
    if (!title || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid input', 'Please enter valid title and amount');
      return;
    }
    addExpense(title, numAmount);
    navigation.goBack();
  };

  return (
    <View style={{ flex:1, padding:20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Add Expense</Text>

      <Text>Title</Text>
      <TextInput
        style={{ borderWidth:1, padding:8, marginBottom:10 }}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., Coffee"
      />

      <Text>Amount (k)</Text>
      <TextInput
        style={{ borderWidth:1, padding:8, marginBottom:10 }}
        value={amount}
        onChangeText={setAmount}
        placeholder="e.g., 30"
        keyboardType="numeric"
      />

      <Button title="Save Expense" onPress={handleSave} />
    </View>
  );
}

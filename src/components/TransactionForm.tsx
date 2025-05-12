import React, { useState } from 'react';
import { View, Text ,
   TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { Transaction } from '../types/types';

type Props = {
  initial?: Transaction;
  type: 'income' | 'expense';
  onSubmit: (transaction: Transaction) => void;
};

export default function TransactionForm({ initial, type, onSubmit }: Props) {
  // const [title, setTitle] = useState(initial?.title || '');
  // const [amount, setAmount] = useState(initial?.amount.toString() || '');
  // const [category, setCategory] = useState(initial?.category || 'Khác');

  // const handleSubmit = () => {
  //   const transaction: Transaction = {
  //     id: initial?.id || Date.now().toString(),
  //     title,
  //     amount: parseFloat(amount),
  //     category,
  //     type,
  //     date: new Date().toISOString().slice(0, 10),
  //   };
  //   onSubmit(transaction);
  //   setTitle('');
  //   setAmount('');
  //   setCategory('Khác');
  // };

  return (
    <View>
      <Text>aa</Text>
      {/* <TextInput placeholder="Tiêu đề" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Số tiền" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Picker selectedValue={category} onValueChange={setCategory}>
        <Picker.Item label="Lương" value="Lương" />
        <Picker.Item label="Ăn uống" value="Ăn uống" />
        <Picker.Item label="Giải trí" value="Giải trí" />
        <Picker.Item label="Khác" value="Khác" />
      </Picker>
      <Button title={initial ? 'Cập nhật' : 'Thêm'} onPress={handleSubmit} /> */}
    </View>
  );
}

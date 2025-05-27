import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

type Props = {
  initialTitle?: string;
  initialAmount?: number;
  initialDate?: string;
  initialCategory?: string;
  onSubmit: (title: string, amount: number, date: string, category: string) => void;
};

export const ExpenseForm: React.FC<Props> = ({
  initialTitle = '',
  initialAmount = 0,
  initialDate = '',
  initialCategory = '',
  onSubmit,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [amount, setAmount] = useState(String(initialAmount));
  const [date, setDate] = useState(initialDate);
  const [category, setCategory] = useState(initialCategory);

  return (
    <View style={styles.container}>
      <Text>Tiêu đề</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề"
        value={title}
        onChangeText={setTitle}
      />
      <Text>Số tiền</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số tiền"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Text>Ngày (yyyy-mm-dd)</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />
      <Text>Danh mục</Text>
      <TextInput
        style={styles.input}
        placeholder="Danh mục (ăn uống, di chuyển...)"
        value={category}
        onChangeText={setCategory}
      />

      <Button
        title="Lưu"
        onPress={() => onSubmit(title, parseFloat(amount), date, category)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4,
  },
});

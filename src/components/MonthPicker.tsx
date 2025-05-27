import React from 'react';
import { View, Text, Button } from 'react-native';

type Props = {
  selectedMonth: string;
  onChange: (month: string) => void;
};

export default function MonthPicker({ selectedMonth, onChange }: Props) {
  const changeMonth = (offset: number) => {
    const date = new Date(selectedMonth + '-01');
    date.setMonth(date.getMonth() + offset);
    onChange(date.toISOString().slice(0, 7));
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
      <Button title="←" onPress={() => changeMonth(-1)} />
      <Text style={{ fontSize: 18 }}>{selectedMonth}</Text>
      <Button title="→" onPress={() => changeMonth(1)} />
    </View>
  );
}

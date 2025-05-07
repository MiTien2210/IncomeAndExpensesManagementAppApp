import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ExpenseContext } from '../context/ExpenseContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ExpenseDetail'>;
  route: RouteProp<RootStackParamList, 'ExpenseDetail'>;
};

export default function ExpenseDetailScreen({ navigation, route }: Props) {
  const { expenses } = useContext(ExpenseContext);
  const expense = expenses.find((e) => e.id === route.params.id);

  if (!expense) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <Text>Expense not found.</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize:24, marginBottom:10 }}>Expense Detail</Text>
      <Text>Title: {expense.title}</Text>
      <Text>Amount: {expense.amount}k</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

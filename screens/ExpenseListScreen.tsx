import React, {useContext, useMemo} from 'react';
import {View, Text, FlatList, Button, StyleSheet, Alert} from 'react-native';
import {ExpenseContext} from '../context/ExpenseContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, Expense} from '../types';

type ExpenseListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ExpenseList'
>;

export default function ExpenseListScreen() {
  const {expenses, deleteExpense} = useContext(ExpenseContext);
  const navigation = useNavigation<ExpenseListScreenNavigationProp>();

  // 👉 Tính tổng chi tiêu
  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa khoản chi tiêu này không?',
      [
        {text: 'Hủy', style: 'cancel'},
        {text: 'Xóa', style: 'destructive', onPress: () => deleteExpense(id)},
      ],
    );
  };

  const renderItem = ({item}: {item: Expense}) => (
    <View style={styles.item}>
      <View style={{flex: 1}}>
        <Text style={styles.itemText}>{item.title}</Text>
        <Text style={styles.itemSub}>Số tiền: ${item.amount}</Text>
      </View>
      <View style={styles.buttons}>
        <Button
          title="Chi tiết"
          onPress={() => navigation.navigate('ExpenseDetail', {id: item.id})}
        />
        <Button title="Xóa" color="red" onPress={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Thêm khoản chi tiêu"
        onPress={() => navigation.navigate('AddExpense')}
      />
      <Button
        title="Xem thống kê"
        onPress={() => navigation.navigate('ExpenseStatistics')}
      />
      <Text style={styles.heading}>Danh sách chi tiêu</Text>
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />

      {/* 👉 Hiển thị tổng chi tiêu */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng chi tiêu: ${totalExpense}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16},
  heading: {fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8},
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {fontSize: 16, fontWeight: 'bold'},
  itemSub: {color: '#666'},
  buttons: {flexDirection: 'row', gap: 8},

  // 👉 Style cho tổng
  totalContainer: {
    marginTop: 16,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalText: {fontSize: 18, fontWeight: 'bold', color: '#333'},
});

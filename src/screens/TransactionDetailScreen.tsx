import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ParamList } from '../types/types';
import { deleteTransaction } from '../storage/storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TransactionContext } from '../context/TransactionContext';

export default function TransactionDetailScreen() {
  // Lấy transaction từ params
  const route = useRoute<RouteProp<ParamList, 'TransactionDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const { transaction } = route.params;

  // Lấy hàm loadTransactions từ Context để reload dữ liệu toàn app
  const { loadTransactions } = useContext(TransactionContext);

  // Định dạng ngày tháng theo tiếng Việt
  const formattedDate = new Date(transaction.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Xác nhận xóa giao dịch
  const confirmDelete = () => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa giao dịch này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: handleDelete },
    ]);
  };

  // Thực hiện xóa giao dịch, reload dữ liệu, quay lại màn hình trước
  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      await loadTransactions();  // Cập nhật dữ liệu toàn bộ app sau khi xóa
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa giao dịch. Vui lòng thử lại.');
      console.error('Delete transaction error:', error);
    }
  };

  // Điều hướng sang màn hình chỉnh sửa với transaction hiện tại
  const handleEdit = () => {
    navigation.navigate('EditTransaction', { transaction });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {transaction.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
      </Text>

      <Text style={styles.label}>Số tiền:</Text>
      <Text style={styles.value}>
        {transaction.type === 'income' ? '+' : '-'}
        {transaction.amount.toLocaleString()}₫
      </Text>

      <Text style={styles.label}>Ghi chú:</Text>
      <Text style={styles.value}>{transaction.note || 'Không có'}</Text>

      <Text style={styles.label}>Danh mục:</Text>
      <Text style={styles.value}>{transaction.category.text}</Text>

      <Text style={styles.label}>Ngày:</Text>
      <Text style={styles.value}>{formattedDate}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  value: { fontSize: 16, color: '#333' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

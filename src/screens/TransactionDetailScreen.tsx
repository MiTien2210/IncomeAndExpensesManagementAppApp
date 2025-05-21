import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ParamList } from '../types/types';
import { deleteTransaction } from '../storage/storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TransactionContext } from '../context/TransactionContext';
import { colors } from '../styles/styles';

export default function TransactionDetailScreen() {
  const route = useRoute<RouteProp<ParamList, 'TransactionDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const { transaction } = route.params;
  const { loadTransactions } = useContext(TransactionContext);

  const formattedDate = new Date(transaction.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const confirmDelete = () => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa giao dịch này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: handleDelete },
    ]);
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      await loadTransactions();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa giao dịch. Vui lòng thử lại.');
      console.error('Delete transaction error:', error);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditTransaction', { transaction });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {transaction.type === 'income' ? '📥 Thu nhập' : '📤 Chi tiêu'}
        </Text>

        <View style={styles.item}>
          <Text style={styles.label}>💰 Số tiền</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  transaction.type === 'income'
                    ? colors.income
                    : colors.expense,
                fontWeight: 'bold',
                fontSize: 20,
              },
            ]}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {transaction.amount.toLocaleString()}₫
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>📝 Ghi chú</Text>
          <Text style={styles.value}>{transaction.note || 'Không có'}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>📂 Danh mục</Text>
          <Text style={styles.value}>{transaction.category.text}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>📅 Ngày</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>✏️ Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
            <Text style={styles.buttonText}>🗑️ Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  item: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 17,
    color: colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  editButton: {
    backgroundColor: colors.income,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: colors.expense,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

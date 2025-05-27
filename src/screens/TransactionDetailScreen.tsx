import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {ParamList} from '../types/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TransactionContext} from '../context/TransactionContext';
import {colors} from '../styles/styles';
import {ICON} from '../constants/constants';
import {formatCurrency} from '../helpers/helpers';
import {UserContext} from '../context/UserContext';

export default function TransactionDetailScreen() {
  const {user} = useContext(UserContext);
  const route = useRoute<RouteProp<ParamList, 'TransactionDetail'>>();

  const {deleteTransaction, transactions} = useContext(TransactionContext);

  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const {transaction, isAdd} = route.params;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formattedDate = new Date(transaction.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const transactionInStore =
    transactions.find(x => x.id === transaction.id) || transaction;

  const confirmDelete = () => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa giao dịch này?', [
      {text: 'Hủy', style: 'cancel'},
      {text: 'Xóa', style: 'destructive', onPress: handleDelete},
    ]);
  };

  const handleDelete = async () => {
    try {
      if (!user) return;
      setIsLoading(true);
      deleteTransaction(transactionInStore.id);
      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa giao dịch. Vui lòng thử lại.');
      console.error('Delete transaction error:', error);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditTransaction', {transaction: transactionInStore});
  };

  const onFinish = () => {
    navigation.navigate('Tabs', {screen: 'Sổ giao dịch'});
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {transactionInStore.type === 'income'
            ? `${ICON.INCOME} Thu nhập`
            : `${ICON.EXPENSE} Chi tiêu`}
        </Text>

        <View style={styles.item}>
          <Text style={styles.label}>{ICON.MONEY} Số tiền</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  transactionInStore.type === 'income'
                    ? colors.income
                    : colors.expense,
                fontWeight: 'bold',
                fontSize: 18,
              },
            ]}>
            {transactionInStore.type === 'income' ? '+' : '-'}
            {formatCurrency(transactionInStore.amount)}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>{ICON.NOTE} Ghi chú</Text>
          <Text style={styles.value}>
            {transactionInStore.note || 'Không có'}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>{ICON.CATEGORY} Danh mục</Text>
          <Text style={styles.value}>{transactionInStore.category.text}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>{ICON.CALENDAR} Ngày</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            disabled={isLoading}>
            <Text style={styles.buttonText}>{ICON.EDIT} Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={confirmDelete}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{ICON.DELETE} Xóa</Text>
            )}
          </TouchableOpacity>
        </View>
        {isAdd && (
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: colors.main,
                marginTop: 20,
                padding: 10,
                borderRadius: 10,
              }}
              onPress={onFinish}
              disabled={isLoading}>
              <Text style={styles.buttonText}>{ICON.FINISH} Hoàn thành</Text>
            </TouchableOpacity>
          </View>
        )}
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
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: colors.main,
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
    // backgroundColor: "red",
    display: 'flex',
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: 500,
  },
  buttonContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // justifyContent: 'center',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: colors.income,
    paddingVertical: 14,
    // paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    // height:30
  },
  deleteButton: {
    backgroundColor: colors.expense,
    paddingVertical: 14,
    // paddingHorizontal: 20,
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

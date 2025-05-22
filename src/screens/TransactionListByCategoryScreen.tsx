import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  RouteProp,
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList, Transaction } from '../types/types';
import { getTransactions } from '../storage/storage';

// Màu sắc đồng bộ với hệ thống
export const colors = {
  primary: '#54A5FC',
  main: '#6200ee',
  income: '#30B540',
  incomeLight: '#81C784',
  expense: '#EE1202',
  expenseLight: '#FAABAB',
  accent: '#BDDFFC',
  warning: '#FFC107',
  background: '#E3F2FD',
  surface: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#757575',
  border: '#90CAF9',
};

type NavigationProp = NativeStackNavigationProp<ParamList>;
type RouteProps = RouteProp<ParamList, 'TransactionListByCategory'>;

export default function TransactionListByCategoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { categoryName, type, isParent } = route.params;

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        const data = await getTransactions();
        const result = (data ?? []).filter((t: Transaction) => {
          const matchType = t.type === type;
          const matchCategory = isParent
            ? t.category.type === categoryName
            : t.category.text === categoryName;
          return matchType && matchCategory;
        });
        setFilteredTransactions(result);
      };
      load();
    }, [categoryName, type, isParent])
  );

  const renderItem = ({ item }: { item: Transaction }) => {
    const formattedDate = new Date(item.date).toLocaleDateString('vi-VN');
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
      >
        <View>
          <Text
            style={[
              styles.amount,
              { color: item.type === 'income' ? colors.income : colors.expense },
            ]}
          >
            {item.type === 'income' ? '+' : '-'}
            {item.amount.toLocaleString()}₫
          </Text>
          <Text style={styles.note}>{item.note || 'Không có ghi chú'}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Giao dịch {type === 'income' ? 'thu nhập' : 'chi tiêu'} -{' '}
        {isParent ? 'Danh mục cha' : 'Danh mục con'}: {categoryName}
      </Text>

      {filteredTransactions.length === 0 ? (
        <Text style={styles.emptyText}>Không có giao dịch nào.</Text>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  note: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: colors.textSecondary,
  },
});

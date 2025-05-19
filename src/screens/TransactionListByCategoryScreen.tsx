import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList, Transaction } from '../types/types';
import { getTransactions } from '../storage/storage';

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
          <Text style={styles.amount}>
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
          keyExtractor={item => item.id} // dùng id thay vì index
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
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  note: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
  },
});

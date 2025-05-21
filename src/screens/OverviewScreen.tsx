import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamList, Transaction} from '../types/types';
import {TransactionContext} from '../context/TransactionContext';
import {PieChart} from 'react-native-chart-kit';
import { colors } from '../styles/styles';

type NavigationProp = NativeStackNavigationProp<ParamList, 'Tabs'>;

const screenWidth = Dimensions.get('window').width;

interface CategoryData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

const OverviewScreen = () => {
  const {transactions} = useContext(TransactionContext);
  const [chartData, setChartData] = useState<CategoryData[]>([]);
  const [showIncomeChart, setShowIncomeChart] = useState(false);
  const [useParentCategory, setUseParentCategory] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const calculateChartData = (
    transactions: Transaction[],
    type: 'income' | 'expense',
  ): CategoryData[] => {
    const filtered = transactions.filter(t => t.type === type);
    const sums: {[key: string]: {amount: number; color: string}} = {};

    filtered.forEach(item => {
      const key = useParentCategory ? item.category.type : item.category.text;
      const color = useParentCategory
        ? item.category.typeColor
        : item.category.color;

      if (!sums[key]) {
        sums[key] = {
          amount: 0,
          color: color || getRandomColor(),
        };
      }
      sums[key].amount += item.amount;
    });

    return Object.keys(sums).map(k => ({
      name: k,
      amount: sums[k].amount,
      color: sums[k].color,
      legendFontColor: colors.textSecondary,
      legendFontSize: 15,
    }));
  };

  useEffect(() => {
    const type = showIncomeChart ? 'income' : 'expense';
    const data = calculateChartData(transactions, type);
    setChartData(data);
  }, [transactions, showIncomeChart, useParentCategory]);

  const totalAmount = chartData.reduce((acc, item) => acc + item.amount, 0);

  const handleCategoryPress = (categoryName: string) => {
    navigation.navigate('TransactionListByCategory', {
      categoryName,
      type: showIncomeChart ? 'income' : 'expense',
      isParent: useParentCategory,
    });
  };

  return (
    <View style={styles.container}>
      {/* Nút chọn Chi tiêu / Thu nhập */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor: colors.expense,
              backgroundColor: !showIncomeChart
                ? colors.expenseLight
                : colors.surface,
            },
          ]}
          onPress={() => setShowIncomeChart(false)}>
          <Text style={styles.buttonText}>💸 Chi tiêu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor: colors.income,
              backgroundColor: showIncomeChart
                ? colors.incomeLight
                : colors.surface,
            },
          ]}
          onPress={() => setShowIncomeChart(true)}>
          <Text style={styles.buttonText}>💵 Thu nhập</Text>
        </TouchableOpacity>
      </View>

      {/* Tổng số tiền */}
      <View style={styles.summaryContainer}>
        <Text style={styles.totalText}>
          Tổng {showIncomeChart ? 'thu nhập' : 'chi tiêu'}: {totalAmount}₫
        </Text>
      </View>

      {/* Tiêu đề biểu đồ */}
      <Text style={styles.header}>
        📊 Biểu đồ {showIncomeChart ? 'thu nhập' : 'chi tiêu'} theo{' '}
        {useParentCategory ? 'danh mục cha' : 'danh mục con'}
      </Text>

      {/* Biểu đồ tròn */}
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute
        />
      ) : (
        <Text style={styles.text}>Không có dữ liệu</Text>
      )}

      {/* Nút chuyển danh mục */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.smallButton,
            {
              borderColor: colors.primary,
              backgroundColor: !useParentCategory
                ? colors.accent
                : colors.surface,
            },
          ]}
          onPress={() => setUseParentCategory(false)}>
          <Text style={styles.smallButtonText}>📂 Danh mục con</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.smallButton,
            {
              borderColor: colors.primary,
              backgroundColor: useParentCategory
                ? colors.accent
                : colors.surface,
            },
          ]}
          onPress={() => setUseParentCategory(true)}>
          <Text style={styles.smallButtonText}>🗂️ Danh mục cha</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách danh mục */}
      <Text style={styles.listHeader}>📑 Chi tiết danh mục:</Text>
      <FlatList
        data={chartData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleCategoryPress(item.name)}>
            <View style={[styles.colorBox, {backgroundColor: item.color}]} />
            <View style={styles.listItemText}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.amountText}>{item.amount}₫</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 16,
    color: colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  summaryContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    marginVertical: 10,
    textAlign: 'center',
  },
  listHeader: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
  },
  listItemText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
});

export default OverviewScreen;

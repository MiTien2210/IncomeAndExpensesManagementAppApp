import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList, Transaction } from '../types/types';
import { TransactionContext } from '../context/TransactionContext';
import { PieChart } from 'react-native-chart-kit';
import { colors } from '../styles/styles';
import moment from 'moment';
import { ICON } from '../constants/constants';
import { formatCurrency } from '../helpers/helpers';

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
  const { transactions } = useContext(TransactionContext);
  const [chartData, setChartData] = useState<CategoryData[]>([]);
  const [chartDataInCome, setChartDataInCome] = useState<CategoryData[]>([]);
  const [chartDataExpense, setChartDataExpense] = useState<CategoryData[]>([]);
  const [chartDataBefor, setChartDataBefor] = useState<CategoryData[]>([]);
  const [showIncomeChart, setShowIncomeChart] = useState(false);
  const [useParentCategory, setUseParentCategory] = useState(false);

  console.log("transactions222:::",transactions);
  


  const navigation = useNavigation<NavigationProp>();

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [selectedMonth, setSelectedMonth] = useState(
    moment().format('YYYY-MM'),
  );

  const previousMonth = moment(selectedMonth, 'YYYY-MM').subtract(1, 'month').format('YYYY-MM');

  const last6Months = Array.from({ length: 6 }, (_, i) =>
    moment().subtract(i, 'months').format('YYYY-MM'),
  );


  const calculateChartData = (
    transactions: Transaction[],
    type: 'income' | 'expense',
  ): CategoryData[] => {
    const filtered = transactions.filter(t => t.type === type);
    const sums: { [key: string]: { amount: number; color: string } } = {};

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
      legendFontSize: 10,
    }));
  };

  useEffect(() => {
    // const type = showIncomeChart ? 'income' : 'expense';
    const filteredTransactions = transactions.filter(
      t => moment(t.date).format('YYYY-MM') === selectedMonth,
    );

    const filteredTransactionsPrev = transactions.filter(
      t => moment(t.date).format('YYYY-MM') === previousMonth,
    );
    const dataIncome = calculateChartData(filteredTransactions, 'income') || [];
    const dataExpense = calculateChartData(filteredTransactions, 'expense') || [];
    const dataPrevIncome = calculateChartData(filteredTransactionsPrev, 'income') || [];
    const dataPrevExpense = calculateChartData(filteredTransactionsPrev, 'expense') || [];
    const data = showIncomeChart ? dataIncome : dataExpense;
    const dataPrev = showIncomeChart ? dataPrevIncome : dataPrevExpense;

    setChartData(data);
    setChartDataInCome(dataIncome);
    setChartDataExpense(dataExpense);
    setChartDataBefor(dataPrev);

  }, [transactions, showIncomeChart, useParentCategory, selectedMonth]);

  const totalAmountIncome = chartDataInCome.reduce((acc, item) => acc + item.amount, 0);
  const totalAmountExpense = chartDataExpense.reduce((acc, item) => acc + item.amount, 0);
  const totalAmountPrev = chartDataBefor.reduce((acc, item) => acc + item.amount, 0);

  const handleCategoryPress = (categoryName: string) => {
    navigation.navigate('TransactionListByCategory', {
      categoryName,
      type: showIncomeChart ? 'income' : 'expense',
      isParent: useParentCategory,
    });
  };

  const renderStatistic = () => {
    const totalAmount = showIncomeChart ? totalAmountIncome : totalAmountExpense;
    const compareNumber = totalAmount - totalAmountPrev
    const isIncrease = compareNumber >= 0;
    return <View style={{
      minHeight: 30,
      padding: 20
    }}>
      <Text style={{
        fontSize: 12
      }}>{isIncrease ? ICON.CHART_INCREASE : ICON.CHART_DECREASE} {isIncrease ? "Tăng" : "Giảm"} <Text style={{
        color: isIncrease ? colors.income : colors.expense,
        fontSize: 12
      }}>{formatCurrency(compareNumber)}</Text> so với cùng kỳ tháng trước đó</Text>
    </View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.monthPicker}>
        <FlatList
          data={last6Months}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          renderItem={({ item }) => {
            const isSelected = item === selectedMonth;
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedMonth(item);
                }}
                style={[
                  styles.monthItem,
                  isSelected && styles.monthItemSelected,
                ]}>
                <Text
                  style={[
                    styles.monthItemText,
                    isSelected && styles.monthItemTextSelected,
                  ]}>
                  {moment(item).format('MM/YYYY')}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.tabContainer}>
        {/* Chi tiêu */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            showIncomeChart ? null : styles.tabButtonActiveExpense,
          ]}
          onPress={() => setShowIncomeChart(false)}
        >
          <Text style={styles.tabTitle}>
            {ICON.EXPENSE} Chi tiêu
          </Text>
          <Text style={{ ...styles.tabAmount, color: colors.expense }}>
            - {totalAmountExpense.toLocaleString()}₫
          </Text>
        </TouchableOpacity>

        {/* Thu nhập */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            showIncomeChart ? styles.tabButtonActiveIncome : null,
          ]}
          onPress={() => setShowIncomeChart(true)}
        >
          <Text style={styles.tabTitle}>
            {ICON.INCOME} Thu nhập
          </Text>
          <Text style={{ ...styles.tabAmount, color: colors.income }}>
            {totalAmountIncome.toLocaleString()}₫
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {renderStatistic()}
      </View>

      {/* Tiêu đề biểu đồ */}
      <Text style={styles.header}>
        {ICON.CHART} Biểu đồ {showIncomeChart ? 'thu nhập' : 'chi tiêu'} theo{' '}
        {useParentCategory ? 'danh mục cha' : 'danh mục con'}
      </Text>

      {/* Biểu đồ tròn */}
      <View style={{
        // backgroundColor:"red",
      }}>
        {chartData.length > 0 ? (
          <PieChart
            data={chartData}
            width={screenWidth - 60}
            height={180}
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
            center={[0, 0]}
            absolute
          />
        ) : (
          <Text style={styles.text}>Không có dữ liệu</Text>
        )}
      </View>
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
          <Text style={styles.smallButtonText}>{ICON.CATEGORY} Danh mục con</Text>
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
          <Text style={styles.smallButtonText}>{ICON.FATHER_CATEGORY} Danh mục cha</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách danh mục */}
      <Text style={styles.listHeader}>{ICON.DETAIL_CATEGORY} Chi tiết danh mục:</Text>
      <FlatList
        data={chartData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleCategoryPress(item.name)}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <View style={styles.listItemText}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={{ ...styles.amountText, color: showIncomeChart ? colors.income : colors.expense }}>{showIncomeChart ? '+' : "-"} {formatCurrency(item.amount)}</Text>
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
  monthPicker: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  monthItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  monthItemSelected: {
    backgroundColor: colors.primary,
  },
  monthItemText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  monthItemTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    // marginVertical: ,
    color: colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },

  tabButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    // borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },

  tabButtonActiveExpense: {
    backgroundColor: '#FFF1F0',
    borderColor: '#FF4D4F',
  },

  tabButtonActiveIncome: {
    backgroundColor: '#F6FFED',
    borderColor: '#52C41A',
  },

  tabTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.main
  },

  tabAmount: {
    fontSize: 14,
    color: '#666',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    // borderWidth: 2,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.main,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    // borderWidth: 1.5,
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

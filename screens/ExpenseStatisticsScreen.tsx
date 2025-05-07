import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // Biểu đồ đường
import { ExpenseContext } from '../context/ExpenseContext';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function ExpenseStatisticsScreen() {
  const { expenses } = useContext(ExpenseContext);

  // 👉 Tính tổng chi tiêu theo tháng (giả sử chi tiêu có thời gian)
  const expensesByMonth = useMemo(() => {
    const groupedExpenses: Record<string, number> = {};

    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (groupedExpenses[month]) {
        groupedExpenses[month] += expense.amount;
      } else {
        groupedExpenses[month] = expense.amount;
      }
    });

    return Object.entries(groupedExpenses).map(([month, amount]) => ({ month, amount }));
  }, [expenses]);

  // Data cho biểu đồ
  const chartData = {
    labels: expensesByMonth.map(item => item.month),
    datasets: [
      {
        data: expensesByMonth.map(item => item.amount),
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Màu cho đường
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Thống kê chi tiêu theo tháng</Text>
      
      {/* Biểu đồ chi tiêu */}
      <LineChart
        data={chartData}
        width={screenWidth - 32} // Chiều rộng của biểu đồ
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2, // Số chữ số thập phân
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
});

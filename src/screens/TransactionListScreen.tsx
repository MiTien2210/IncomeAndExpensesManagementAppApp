import React, { useContext, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { TransactionContext } from '../context/TransactionContext';
import TransactionItem from '../components/TransactionItem';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList } from '../types/types';
import { colors } from '../styles/styles';
import { formatCurrency } from '../helpers/helpers';

type TransactionListScreenNavigationProp = NativeStackNavigationProp<
  ParamList,
  'TransactionList'
>;

const TransactionListScreen = () => {
  const navigation = useNavigation<TransactionListScreenNavigationProp>();

  const { transactions } = useContext(TransactionContext);

  const [selectedMonth, setSelectedMonth] = useState(
    moment().format('YYYY-MM'),
  );
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  const filteredTransactions = transactions.filter(
    t => moment(t.date).format('YYYY-MM') === selectedMonth,
  );

  const { totalIncome, totalExpense, difference } = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return {
      totalIncome: income,
      totalExpense: expense,
      // difference: income - expense,
      difference: income - expense,
    };
  }, [filteredTransactions]);

  const transactionsInSelectedDate = transactions.filter(
    t => moment(t.date).format('YYYY-MM-DD') === selectedDate,
  );

  const last6Months = Array.from({ length: 6 }, (_, i) =>
    moment().subtract(i, 'months').format('YYYY-MM'),
  );

  const generateCalendarDays = (currentMonth: moment.Moment): (string | null)[] => {
    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');

    const startDay = startOfMonth.day(); // 0 (CN) -> 6 (T7)
    const daysInMonth = endOfMonth.date();

    const days: (string | null)[] = [];

    // Ô trống trước ngày 1
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Ngày trong tháng
    for (let i = 1; i <= daysInMonth; i++) {
      const date = currentMonth.clone().date(i).format('YYYY-MM-DD');
      days.push(date);
    }

    // Ô trống sau cùng để đủ 6 hàng
    while (days.length < 42) {
      days.push(null);
    }

    return days;
  };

  const getCalendarWeeks = (calendarDays: (string | null)[]): (string | null)[][] => {
    const weeks: (string | null)[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }
    return weeks;
  };

  const calendarDays = generateCalendarDays(moment(selectedMonth));
  console.log("calendarDays::", calendarDays);
  const weeks = getCalendarWeeks(calendarDays);



  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header tổng quan thu chi */}
      <View style={styles.summaryContainer}>
        <Text style={styles.monthTitle}>
          {moment(selectedMonth).format('MM/YYYY')}
        </Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Tổng Chi</Text>
            <Text style={[styles.summaryValue, { color: colors.expense }]}>
              {formatCurrency(totalExpense.toFixed(0))}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Tổng Thu</Text>
            <Text style={[styles.summaryValue, { color: colors.income }]}>
              {formatCurrency(totalIncome.toFixed(0))}
            </Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Chênh Lệch</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: difference >= 0 ? colors.income : colors.expense },
              ]}>
              {formatCurrency(difference.toFixed(0))}
            </Text>
          </View>
        </View>
      </View>

      {/* Thanh chọn tháng */}
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
                  setSelectedDate(
                    moment(item).startOf('month').format('YYYY-MM-DD'),
                  );
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

      {/* Calendar hiển thị ngày trong tháng */}
      <View style={styles.calendarContainer}>
        <View style={styles.weekdayRow}>
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
            <Text key={day} style={styles.weekdayText}>
              {day}
            </Text>
          ))}
        </View>

        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((date, index) => {
              if (!date) {
                return <View key={index} style={styles.dayCell} />;
              }

              const isSelected = date === selectedDate;

              const dayTransactions = transactions.filter(
                t => moment(t.date).format('YYYY-MM-DD') === date,
              );

              const dayIncome = dayTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

              const dayExpense = dayTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

              return (
                <TouchableOpacity
                  key={date}
                  style={[styles.dayCell, isSelected && styles.selectedDayCell]}
                  onPress={() => setSelectedDate(date)}
                  activeOpacity={0.7}>
                  <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                    {moment(date).date()}
                  </Text>

                  <View style={styles.incomeExpenseContainer}>
                    {dayIncome > 0 && (
                      <Text style={styles.incomeTextSmall}>
                        +{(dayIncome / 1000).toFixed(0)}k
                      </Text>
                    )}
                    {dayExpense > 0 && (
                      <Text style={styles.expenseTextSmall}>
                        -{(dayExpense / 1000).toFixed(0)}k
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>


      {/* Danh sách giao dịch */}
      <FlatList
        data={transactionsInSelectedDate.sort((a, b) =>
          a.date < b.date ? 1 : -1,
        )}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TransactionDetail', { transaction: item });
            }}>
            <TransactionItem transaction={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: colors.textSecondary }}>
              Không có giao dịch trong ngày này
            </Text>
          </View>
        }
      />
    </View>
  );
};


const styles = StyleSheet.create({
  summaryContainer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    // color: colors.primary,
    color: colors.main,

    textAlign: "center",
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryBox: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.main,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
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

  // Calendar styles
  calendarContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
    color: colors.textPrimary,
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 2,
    marginVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    position: 'relative',
  },
  selectedDayCell: {
    backgroundColor: colors.accent,
    // borderWidth: 1,
    // borderColor: colors.primary,
  },

  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    // backgroundColor:"red",
    width: "100%",
    height: "100%",
  },
  selectedDayText: {
    color: colors.primary,
  },

  dayNumberContainer: {
    position: 'absolute',
    top: 4,
    left: 4,
  },

  incomeExpenseContainer: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    alignItems: 'flex-end',
  },
  incomeTextSmall: {
    color: colors.income,
    fontSize: 8,
    fontWeight: '600',
    lineHeight: 12,
    // backgroundColor:"red",
  },
  expenseTextSmall: {
    color: colors.expense,
    fontSize: 8,
    fontWeight: '600',
    lineHeight: 12,
  },
});

export default TransactionListScreen;

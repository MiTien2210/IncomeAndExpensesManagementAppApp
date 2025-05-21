import React, {useContext, useState, useMemo} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {TransactionContext} from '../context/TransactionContext';
import TransactionItem from '../components/TransactionItem';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList } from '../types/types';
import { colors } from '../styles/styles';

type TransactionListScreenNavigationProp = NativeStackNavigationProp<
  ParamList,
  'TransactionList'
>;

const TransactionListScreen = () => {
  const navigation = useNavigation<TransactionListScreenNavigationProp>();

  const {transactions} = useContext(TransactionContext);

  const [selectedMonth, setSelectedMonth] = useState(
    moment().format('YYYY-MM'),
  );
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  const filteredTransactions = transactions.filter(
    t => moment(t.date).format('YYYY-MM') === selectedMonth,
  );

  const {totalIncome, totalExpense, difference} = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return {
      totalIncome: income,
      totalExpense: expense,
      difference: income - expense,
    };
  }, [filteredTransactions]);

  const transactionsInSelectedDate = transactions.filter(
    t => moment(t.date).format('YYYY-MM-DD') === selectedDate,
  );

  const last6Months = Array.from({length: 6}, (_, i) =>
    moment().subtract(i, 'months').format('YYYY-MM'),
  );

  const startOfMonth = moment(selectedMonth).startOf('month');
  const endOfMonth = moment(selectedMonth).endOf('month');
  const startDayOfWeek = startOfMonth.day();
  const daysInMonth = endOfMonth.date();

  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(moment(selectedMonth).date(d).format('YYYY-MM-DD'));
  }
  while (calendarDays.length < 42) {
    calendarDays.push(null);
  }

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
      {/* Header tổng quan thu chi */}
      <View style={styles.summaryContainer}>
        <Text style={styles.monthTitle}>
          {moment(selectedMonth).format('MMMM YYYY')}
        </Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Tổng Thu</Text>
            <Text style={[styles.summaryValue, {color: colors.income}]}>
              {totalIncome.toFixed(0)}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Tổng Chi</Text>
            <Text style={[styles.summaryValue, {color: colors.expense}]}>
              {totalExpense.toFixed(0)}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Chênh Lệch</Text>
            <Text
              style={[
                styles.summaryValue,
                {color: difference >= 0 ? colors.income : colors.expense},
              ]}>
              {difference.toFixed(0)}
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
          renderItem={({item}) => {
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

        <View style={styles.calendarGrid}>
          {calendarDays.map((date, index) => {
            if (!date) {
              return <View key={index} style={styles.dayCell} />;
            }
            const isSelected = date === selectedDate;

            const dayTransactions = transactions.filter(
              t => moment(t.date).format('YYYY-MM-DD') === date,
            );
            let dayIncome = 0;
            let dayExpense = 0;
            dayTransactions.forEach(t => {
              if (t.type === 'income') dayIncome += t.amount;
              else dayExpense += t.amount;
            });

            return (
              <TouchableOpacity
                key={date}
                style={[styles.dayCell, isSelected && styles.selectedDayCell]}
                onPress={() => setSelectedDate(date)}
                activeOpacity={0.7}>
                <View style={styles.dayNumberContainer}>
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                    ]}>
                    {moment(date).date()}
                  </Text>
                </View>

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
      </View>

      {/* Danh sách giao dịch */}
      <FlatList
        data={transactionsInSelectedDate.sort((a, b) =>
          a.date < b.date ? 1 : -1,
        )}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TransactionDetail', {transaction: item});
            }}>
            <TransactionItem transaction={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{paddingBottom: 100}}
        ListEmptyComponent={
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={{color: colors.textSecondary}}>
              Không có giao dịch trong ngày này
            </Text>
          </View>
        }
      />
    </View>
  );
};

const CELL_SIZE = 48;

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
    color: colors.textPrimary,
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
    color: colors.textSecondary,
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
  calendarContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekdayText: {
    width: CELL_SIZE,
    textAlign: 'center',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 8,
    margin: 2,
    backgroundColor: colors.surface,
    padding: 4,
    justifyContent: 'space-between',
  },
  selectedDayCell: {
    backgroundColor: colors.accent,
  },
  dayNumberContainer: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  selectedDayText: {
    color: colors.primary,
  },
  incomeExpenseContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    alignItems: 'flex-end',
  },
  incomeTextSmall: {
    color: colors.income,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },
  expenseTextSmall: {
    color: colors.expense,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },
});

export default TransactionListScreen;

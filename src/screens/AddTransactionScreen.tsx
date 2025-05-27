import React, { useState, useContext, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Transaction } from '../types/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import { ParamList } from '../types/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TransactionContext } from '../context/TransactionContext';
import { colors } from '../styles/styles';
import { categoryList, ICON } from '../constants/constants';
import { formatCurrency } from '../helpers/helpers';


const AddForm = ({ type }: { type: 'income' | 'expense' }) => {
  const amountRef = useRef<TextInput>(null)
  const [amount, setAmount] = useState('');
  const [amountView, setAmountView] = useState('');
  const [category, setCategory] = useState(categoryList[type][0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const transactionContext = useContext(TransactionContext);

  if (!transactionContext) {
    throw new Error(
      'TransactionContext must be used within a TransactionProvider',
    );
  }

  const { addTransaction } = transactionContext;

  const handleAdd = async () => {
    if (!amount) {
      Alert.alert('Thông báo', 'Bạn chưa nhập số tiền.');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ lớn hơn 0.');
      return;
    }

    if (!note.trim()) {
      Alert.alert('Thông báo', 'Bạn chưa nhập ghi chú.');
      return;
    }

    const newTransaction: Transaction = {
      id: uuid.v4().toString(),
      type,
      amount: parseFloat(amount),
      category,
      note,
      date: date.toISOString(),
    };

    console.log("newTransaction add::",newTransaction);
    

    addTransaction(newTransaction);

    // Reset form
    setAmount('');
    setAmountView('');
    setNote('');
    setCategory(categoryList[type][0]);
    setIsCategorySelected(false);

    navigation.navigate('TransactionDetail', { transaction: newTransaction, isAdd: true });
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleCategorySelectFromSuggestion = (
    selectedCategory: typeof category,
  ) => {
    setCategory(selectedCategory);
  };

  const handleCategorySelectFromPopup = (selectedCategory: typeof category) => {
    setCategory(selectedCategory);
    setShowCategoryModal(false);
    setIsCategorySelected(true);
  };

  const onFocus = () => {
    if (amountRef.current) {
      amountRef.current?.setNativeProps({ text: amount });
    }
  }
  const onBlur = () => {
    if (amountRef.current) {
      amountRef.current?.setNativeProps({ text: amountView });
    }
  }

  return (
    <View style={styles.formContainer}>
      <TextInput
        ref={amountRef}
        placeholder="Nhập số tiền"
        keyboardType="numeric"
        defaultValue={amount}
        onChangeText={(e) => {
          setAmount(e);
          setAmountView(formatCurrency(e));
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        style={styles.input}
      />
      <TextInput
        placeholder="Ghi chú"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <TouchableOpacity
        style={[
          styles.selectedCategoryContainer,
          { backgroundColor: colors.background },
        ]}
        onPress={() => setShowCategoryModal(true)}>
        <Text
          style={[styles.emojiIcon, { color: category.color, marginRight: 8 }]}>
          {category.emoji}
        </Text>
        <Text style={styles.selectedCategoryText}>{category.text}</Text>
      </TouchableOpacity>

      {!isCategorySelected && (
        <View style={styles.suggestionContainer}>
          {categoryList[type]
            .filter(item => item.highlight)
            .map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.suggestionButton,
                  category.text === item.text &&
                  styles.selectedSuggestionButton,
                ]}
                onPress={() => handleCategorySelectFromSuggestion(item)}>
                <Text
                  style={[
                    styles.emojiIcon,
                    { color: item.color, marginRight: 6 },
                  ]}>
                  {item.emoji}
                </Text>
                <Text
                  style={[
                    styles.suggestionText,
                    category.text === item.text &&
                    styles.selectedSuggestionText,
                  ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}>
        <Text
          style={[styles.emojiIcon, { color: colors.surface, marginRight: 8 }]}>
          {ICON.CALENDAR}
        </Text>
        <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity style={{ ...styles.addButton, backgroundColor: type === 'expense' ? colors.expense : colors.income }} onPress={handleAdd}>
        <Text
          style={[styles.emojiIcon, { marginRight: 8, color: colors.main }]}>
          {ICON.ADD}
        </Text>
        <Text style={styles.addButtonText}>Thêm giao dịch</Text>
      </TouchableOpacity>

      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn danh mục</Text>
            <ScrollView>
              {categoryList[type].map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.modalButton}
                  onPress={() => handleCategorySelectFromPopup(item)}>
                  <Text
                    style={[
                      styles.emojiIcon,
                      { color: item.color, marginRight: 10 },
                    ]}>
                    {item.emoji}
                  </Text>
                  <Text style={styles.modalButtonText}>{item.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCategoryModal(false)}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AddTransactionScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'expense' | 'income'>(
    'expense',
  );

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.tabBarContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            {
              borderColor: colors.expense,
              marginHorizontal: 8,
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor:
                selectedTab === 'expense' ? colors.expenseLight : 'white', // ✅
            },
          ]}
          onPress={() => setSelectedTab('expense')}>
          <Text
            style={[
              styles.emojiIcon,
              {
                marginRight: 6,
                fontSize: 22,
                color: colors.expense, // ✅ đơn giản hoá
              },
            ]}>
            {ICON.EXPENSE}
          </Text>
          <Text
            style={[
              styles.buttonText,
              {
                fontSize: 16,
                color: colors.main
              },
            ]}>
            Chi tiêu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            {
              borderColor: colors.income,
              marginHorizontal: 8,
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor:
                selectedTab === 'income' ? colors.incomeLight : 'white', // ✅
            },
          ]}
          onPress={() => setSelectedTab('income')}>
          <Text
            style={[
              styles.emojiIcon,
              {
                marginRight: 6,
                fontSize: 22,
                color: colors.income, // ✅ đơn giản hoá
              },
            ]}>
            {ICON.INCOME}
          </Text>
          <Text
            style={[
              styles.buttonText,
              {
                fontSize: 16,
                color: colors.main
              },
            ]}>
            Thu nhập
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'expense' && <AddForm type="expense" />}
      {selectedTab === 'income' && <AddForm type="income" />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    padding: 20,
    backgroundColor: colors.background,
  },
  tabBarContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'center',
  },
  tabButton: {
    flex: 1,
    // borderWidth: 2,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
    // color:colors.main
  },
  buttonText: {
    fontWeight: '500',
    color: colors.textPrimary,

  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 50,
    marginTop: 20
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    // borderWidth: 1,
    // borderColor: colors.border,
  },
  selectedCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: colors.border,
    padding: 8,
    marginBottom: 15,
  },
  emojiIcon: {
    fontSize: 18,
  },
  selectedCategoryText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.background,
  },
  selectedSuggestionButton: {
    color: colors.main,
    // backgroundColor: colors.main + '55', // màu accent với alpha mờ
    borderWidth: 1,
    borderColor: colors.main + '55',
  },
  suggestionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  selectedSuggestionText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 500
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'pink',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
    marginTop: 15
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: colors.warning,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
});

export default AddTransactionScreen;

import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
} from 'react-native';
import { Transaction } from '../types/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import { ParamList } from '../types/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TransactionContext } from '../context/TransactionContext'; // Đường dẫn thay thế theo dự án của bạn

const categoryList = {
  income: [
    { id: 1, text: 'Lương', type: 'other', highlight: true, color: 'pink', typeColor: 'blue' },
    { id: 2, text: 'Thưởng', type: 'other', highlight: true, color: 'blue', typeColor: 'blue' },
    { id: 3, text: 'Khác', type: 'other', highlight: true, color: 'yellow', typeColor: 'blue' },
  ],
  expense: [
    { id: 1, text: 'Ăn uống', type: 'Chi tiêu - Sinh hoạt', highlight: true, color: 'blue', typeColor: 'blue' },
    { id: 2, text: 'Mua sắm', type: 'Chi phí phát sinh', highlight: true, color: 'red', typeColor: 'green' },
    { id: 3, text: 'Đi lại', type: 'Chi tiêu - Sinh hoạt', highlight: true, color: 'pink', typeColor: 'blue' },
    { id: 4, text: 'Chợ - Siêu thị', type: 'Chi tiêu - Sinh hoạt', highlight: false, color: 'orange', typeColor: 'blue' },
    { id: 5, text: 'Hóa đơn', type: 'Chi tiêu - Sinh hoạt', highlight: true, color: 'yellow', typeColor: 'blue' },
    { id: 6, text: 'Khác', type: 'other', highlight: true, color: 'green', typeColor: 'yellow' },
  ],
};

const AddForm = ({ type }: { type: 'income' | 'expense' }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categoryList[type][0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const transactionContext = useContext(TransactionContext);

  if (!transactionContext) {
    throw new Error('TransactionContext must be used within a TransactionProvider');
  }

  const { addTransaction } = transactionContext;

  const handleAdd = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      // alert('Vui lòng nhập số tiền hợp lệ');
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

    addTransaction(newTransaction);

    // Reset form
    setAmount('');
    setNote('');
    setCategory(categoryList[type][0]);
    setIsCategorySelected(false);

    navigation.navigate('TransactionDetail', { transaction: newTransaction });
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleCategorySelectFromSuggestion = (selectedCategory: typeof category) => {
    setCategory(selectedCategory);
  };

  const handleCategorySelectFromPopup = (selectedCategory: typeof category) => {
    setCategory(selectedCategory);
    setShowCategoryModal(false);
    setIsCategorySelected(true);
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        placeholder="Nhập số tiền"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />
      <TextInput
        placeholder="Ghi chú"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.selectedCategoryContainer}
        onPress={() => setShowCategoryModal(true)}>
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
                  category.text === item.text && styles.selectedSuggestionButton,
                ]}
                onPress={() => handleCategorySelectFromSuggestion(item)}>
                <Text
                  style={[
                    styles.suggestionText,
                    category.text === item.text && styles.selectedSuggestionText,
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

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
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
  const [selectedTab, setSelectedTab] = useState<'expense' | 'income'>('expense');

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.tabBarContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'expense' && styles.selectedTab]}
          onPress={() => setSelectedTab('expense')}>
          <Text style={[styles.tabButtonText, selectedTab === 'expense' && styles.selectedTabText]}>
            Chi tiêu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'income' && styles.selectedTab]}
          onPress={() => setSelectedTab('income')}>
          <Text style={[styles.tabButtonText, selectedTab === 'income' && styles.selectedTabText]}>
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
  screenContainer: { padding: 20, backgroundColor: '#f9f9f9' },
  tabBarContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  tabButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ddd',
    flex: 1,
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: '#6200EE',
  },
  tabButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  selectedTabText: {
    color: '#fff',
  },
  formContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  selectedCategoryContainer: {
    marginBottom: 15,
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
  },
  selectedCategoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  suggestionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  selectedSuggestionButton: {
    backgroundColor: '#6200EE',
    borderWidth: 1,
    borderColor: '#6200EE',
  },
  selectedSuggestionText: {
    color: '#ffffff',
  },
  dateButton: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;

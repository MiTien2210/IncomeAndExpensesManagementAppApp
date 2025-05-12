import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
} from 'react-native';
import {Transaction} from '../types/types';
import {getTransactions, saveTransactions} from '../storage/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';

const categoryList = {
  income: ['Lương', 'Thưởng', 'Khác'],
  expense: ['Ăn uống', 'Mua sắm', 'Đi lại', 'Khác'],
};

const AddForm = ({type}: {type: 'income' | 'expense'}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(
    type === 'income' ? 'Lương' : 'Ăn uống',
  );
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date()); // Default is today's date
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isCategorySelected, setIsCategorySelected] = useState(false); // Track if category has been selected

  const handleAdd = async () => {
    const newTransaction: Transaction = {
      id: uuid.v4().toString(),
      type,
      amount: parseFloat(amount),
      category,
      note,
      date: date.toISOString(),
    };
    const current = await getTransactions();
    await saveTransactions([newTransaction, ...current]);
    setAmount('');
    setNote('');
    setCategory(type === 'income' ? 'Lương' : 'Ăn uống');
    setIsCategorySelected(false); // Reset category selection status after adding transaction
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleCategorySelectFromSuggestion = (selectedCategory: string) => {
    setCategory(selectedCategory); // Update category when selected from suggestion
  };

  const handleCategorySelectFromPopup = (selectedCategory: string) => {
    setCategory(selectedCategory); // Update category when selected from popup
    setShowCategoryModal(false); // Close modal after selection
    setIsCategorySelected(true); // Mark category as selected
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

      {/* Danh mục đã chọn */}
      <TouchableOpacity
        style={styles.selectedCategoryContainer}
        onPress={() => setShowCategoryModal(true)}>
        <Text style={styles.selectedCategoryText}>{category}</Text>
      </TouchableOpacity>

      {/* Gợi ý danh mục chỉ hiển thị nếu chưa chọn danh mục */}
      {!isCategorySelected && (
        <View style={styles.suggestionContainer}>
          {categoryList[type].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.suggestionButton,
                category === item && styles.selectedSuggestionButton,
              ]}
              onPress={() => handleCategorySelectFromSuggestion(item)} // Update category when a suggestion is clicked
            >
              <Text
                style={[
                  styles.suggestionText,
                  category === item && styles.selectedSuggestionText,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Chọn ngày */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {/* Hiển thị DateTimePicker */}
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

      {/* Modal chọn danh mục */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn danh mục</Text>
            <ScrollView>
              {categoryList[type].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalButton}
                  onPress={() => handleCategorySelectFromPopup(item)}>
                  <Text style={styles.modalButtonText}>{item}</Text>
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
            selectedTab === 'expense' && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab('expense')}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'expense' && styles.selectedTabText,
            ]}>
            Chi tiêu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'income' && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab('income')}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'income' && styles.selectedTabText,
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
  screenContainer: {padding: 20, backgroundColor: '#f9f9f9'},
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
  formContainer: {backgroundColor: '#fff', padding: 20, borderRadius: 10},
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
    flexDirection: 'row', // Các gợi ý nằm trên một dòng
    flexWrap: 'wrap', // Các gợi ý sẽ xuống dòng khi không đủ không gian
    marginBottom: 10, // Khoảng cách nhỏ giữa các phần tử
    backgroundColor: '#fff',
    // borderRadius: 8,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 3,
  },
  suggestionButton: {
    paddingVertical: 8, // Kích thước padding nhỏ hơn
    paddingHorizontal: 12, // Giảm kích thước padding
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginRight: 10, // Khoảng cách ngang giữa các gợi ý
    marginBottom: 10, // Khoảng cách dọc giữa các gợi ý
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  selectedSuggestionButton: {
    backgroundColor: '#6200EE', // Màu nền khi chọn
    borderWidth: 1,
    borderColor: '#6200EE',
  },
  selectedSuggestionText : {
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
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#6200EE',
  },
  closeButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddTransactionScreen;

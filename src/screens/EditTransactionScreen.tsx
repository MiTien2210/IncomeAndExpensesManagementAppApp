// import React, { useContext, useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { ParamList, Transaction } from '../types/types';
// import { TransactionContext } from '../context/TransactionContext';

// type Props = NativeStackScreenProps<ParamList, 'EditTransaction'>;

// const EditTransactionScreen = ({ route, navigation }: Props) => {
//   const { transaction } = route.params;  // nhận nguyên transaction
//   const { updateTransaction } = useContext(TransactionContext);

//   const [amount, setAmount] = useState(transaction.amount.toString());
//   const [note, setNote] = useState(transaction.note || '');

//   const handleSave = () => {
//     const newAmount = parseFloat(amount);
//     if (isNaN(newAmount) || newAmount <= 0) {
//       Alert.alert('Lỗi', 'Số tiền không hợp lệ');
//       return;
//     }

//     const updatedTransaction: Transaction = {
//       ...transaction,
//       amount: newAmount,
//       note,
//     };

//     updateTransaction(updatedTransaction);
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Số tiền</Text>
//       <TextInput
//         style={styles.input}
//         value={amount}
//         onChangeText={setAmount}
//         keyboardType="numeric"
//       />
//       <Text style={styles.label}>Ghi chú</Text>
//       <TextInput
//         style={styles.input}
//         value={note}
//         onChangeText={setNote}
//       />
//       <Button title="Lưu" onPress={handleSave} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   label: { fontSize: 16, marginTop: 16 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 6,
//     padding: 8,
//     marginTop: 8,
//   },
// });

// export default EditTransactionScreen;

import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParamList, Transaction} from '../types/types';
import {TransactionContext} from '../context/TransactionContext';
import {categoryList, ICON} from '../constants/constants';
import {colors} from '../styles/styles';

type Props = NativeStackScreenProps<ParamList, 'EditTransaction'>;

// const categoryList = {
//   income: [
//     { id: 1, text: 'Lương', type: 'other', highlight: true, color: 'pink', typeColor: 'blue' },
//     { id: 2, text: 'Thưởng', type: 'other', highlight: true, color: 'blue', typeColor: 'blue' },
//     { id: 3, text: 'Khác', type: 'other', highlight: true, color: 'yellow', typeColor: 'blue' },
//   ],
//   expense: [
//     { id: 1, text: 'Ăn uống', type: 'Chi tiêu - Sinh hoạt', highlight: true, color: 'blue', typeColor: 'blue' },
//     { id: 2, text: 'Mua sắm', type: 'Chi phí phát sinh', highlight: true, color: 'red', typeColor: 'green' },
//     { id: 3, text: 'Đi lại', type: 'Chi tiêu - Sinh hoạt', highlight: true, color: 'pink', typeColor: 'blue' },
//     { id: 4, text: 'Chợ - Siêu thị', type: 'Chi tiêu - Sinh hoạt', highlight: false, color: 'orange', typeColor: 'blue' },
//     { id: 5, text: 'Hóa đơn', type: 'Chi tiêu - Sinh hoạt', highlight: true, color: 'yellow', typeColor: 'blue' },
//     { id: 6, text: 'Khác', type: 'other', highlight: true, color: 'green', typeColor: 'yellow' },
//   ],
// };

const EditTransactionScreen = ({route, navigation}: Props) => {
  const {transaction} = route.params;

  console.log('transaction::', transaction);

  const {updateTransaction} = useContext(TransactionContext);
  const type = transaction.type;

  const [amount, setAmount] = useState(transaction.amount.toString());
  const [note, setNote] = useState(transaction.note || '');
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(new Date(transaction.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleSave = () => {
    const newAmount = parseFloat(amount);
    if (isNaN(newAmount) || newAmount <= 0) {
      Alert.alert('Lỗi', 'Số tiền không hợp lệ');
      return;
    }

    const updatedTransaction: Transaction = {
      ...transaction,
      amount: newAmount,
      note,
      category,
      date: date.toISOString(),
    };

    updateTransaction(updatedTransaction);
    navigation.goBack();
  };

  console.log('transaction:::', transaction);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleCategorySelect = (item: typeof category) => {
    setCategory(item);
    setShowCategoryModal(false);
  };
  const onClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 20,
          margin:20,
          marginTop: 40,
          borderRadius: 16,
          backgroundColor: '#fff',
        }}>
        <View>
          <Text style={styles.title}>
            {transaction.type === 'income'
              ? `${ICON.INCOME} Thu nhập`
              : `${ICON.EXPENSE} Chi tiêu`}
          </Text>
        </View>
        <Text style={styles.label}>{ICON.MONEY} Số tiền</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Text style={styles.label}>{ICON.NOTE} Ghi chú</Text>
        <TextInput style={styles.input} value={note} onChangeText={setNote} />

        <Text style={styles.label}>{ICON.CATEGORY} Danh mục</Text>
        <TouchableOpacity
          style={styles.selectedCategory}
          onPress={() => setShowCategoryModal(true)}>
          <Text>
            {category.emoji} {category.text}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>{ICON.CALENDAR} Ngày</Text>
        <TouchableOpacity
          style={styles.selectedCategory}
          onPress={() => setShowDatePicker(true)}>
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{
              ...styles.editButton,
              backgroundColor:
                type === 'expense' ? colors.expense : colors.income,
            }}
            onPress={handleSave}>
            <Text style={styles.buttonEdit}>{ICON.EDIT} Lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onClose}>
            <Text style={styles.buttonText}>{ICON.CLOSE} Đóng</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showCategoryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <ScrollView>
                {categoryList[transaction.type].map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.modalItem,
                      item.text === category.text && styles.selectedModalItem,
                    ]}
                    onPress={() => handleCategorySelect(item)}>
                    <Text
                      style={{
                        color:
                          item.text === category.text
                            ? '#ffffff'
                            : colors.textPrimary,
                      }}>
                      {item.emoji} {item.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setShowCategoryModal(false)}>
                <Text style={{color: 'white'}}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  label: {fontSize: 16, marginTop: 16},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: colors.main,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  selectedCategory: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#6200EE',
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '70%',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  selectedModalItem: {
    backgroundColor: '#6200EE',
    borderWidth: 1,
    borderColor: '#6200EE',
  },
  closeModalBtn: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // justifyContent: 'center',
    marginTop: 50,
  },
  editButton: {
    backgroundColor: colors.income,
    paddingVertical: 14,
    // paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    color: '#ffffff',
    // height:30
  },
  deleteButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    // paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    borderColor: colors.expense,
    borderWidth: 1,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonEdit: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EditTransactionScreen;

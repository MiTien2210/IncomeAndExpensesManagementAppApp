// import React, { useState } from 'react';
// import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import uuid from 'react-native-uuid';
// import { Transaction } from '../types/types';
// import { getTransactions, saveTransactions } from '../storage/storage';

// const AddForm = ({ type }: { type: 'income' | 'expense' }) => {
//   const [amount, setAmount] = useState('');
//   const [category, setCategory] = useState(type === 'income' ? 'Lương' : 'Ăn uống');
//   const [note, setNote] = useState('');

//   const handleAdd = async () => {
//     const newTransaction: Transaction = {
//       id: uuid.v4().toString(),
//       type,
//       amount: parseFloat(amount),
//       category,
//       note,
//       date: new Date().toISOString(),
//     };
//     const current = await getTransactions();
//     await saveTransactions([newTransaction, ...current]);
//     setAmount('');
//     setNote('');
//   };

//   return (
//     <View style={styles.formContainer}>
//       <TextInput
//         placeholder="Nhập số tiền"
//         keyboardType="numeric"
//         value={amount}
//         onChangeText={setAmount}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Ghi chú"
//         value={note}
//         onChangeText={setNote}
//         style={styles.input}
//       />
//       <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
//         {type === 'income' ? (
//           <>
//             <Picker.Item label="Lương" value="Lương" />
//             <Picker.Item label="Thưởng" value="Thưởng" />
//             <Picker.Item label="Khác" value="Khác" />
//           </>
//         ) : (
//           <>
//             <Picker.Item label="Ăn uống" value="Ăn uống" />
//             <Picker.Item label="Mua sắm" value="Mua sắm" />
//             <Picker.Item label="Đi lại" value="Đi lại" />
//             <Picker.Item label="Khác" value="Khác" />
//           </>
//         )}
//       </Picker>
//       <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
//         <Text style={styles.addButtonText}>Thêm giao dịch</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const AddTransactionScreen = () => {
//   const [selectedTab, setSelectedTab] = useState<'expense' | 'income'>('expense');

//   return (
//     <ScrollView style={styles.screenContainer}>
//       <View style={styles.tabBarContainer}>
//         <TouchableOpacity
//           style={[styles.tabButton, selectedTab === 'expense' && styles.selectedTab]}
//           onPress={() => setSelectedTab('expense')}
//         >
//           <Text style={[styles.tabButtonText, selectedTab === 'expense' && styles.selectedTabText]}>Chi tiêu</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tabButton, selectedTab === 'income' && styles.selectedTab]}
//           onPress={() => setSelectedTab('income')}
//         >
//           <Text style={[styles.tabButtonText, selectedTab === 'income' && styles.selectedTabText]}>Thu nhập</Text>
//         </TouchableOpacity>
//       </View>

//       {selectedTab === 'expense' && <AddForm type="expense" />}
//       {selectedTab === 'income' && <AddForm type="income" />}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   screenContainer: { padding: 20, backgroundColor: '#f9f9f9' },
//   tabBarContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     justifyContent: 'space-between',
//   },
//   tabButton: {
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: '#ddd',
//     flex: 1,
//     alignItems: 'center',
//   },
//   selectedTab: {
//     backgroundColor: '#6200EE',
//   },
//   tabButtonText: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#333',
//   },
//   selectedTabText: {
//     color: '#fff',
//   },
//   formContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
//   input: {
//     borderWidth: 1,
//     padding: 12,
//     marginBottom: 15,
//     borderRadius: 8,
//     borderColor: '#ddd',
//     backgroundColor: '#fff',
//     fontSize: 16,
//   },
//   picker: {
//     backgroundColor: '#fff',
//     marginBottom: 20,
//     borderRadius: 8,
//     height: 50,
//   },
//   addButton: {
//     backgroundColor: '#6200EE',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default AddTransactionScreen;

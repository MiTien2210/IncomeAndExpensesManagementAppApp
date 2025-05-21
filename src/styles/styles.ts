import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 10,
    width: '90%',
    borderRadius: 5,
  },
});

export const colors = {
  primary: '#007bff',        // Màu xanh dương – chủ đạo

  income: '#4CAF50',         // Xanh lá – thu nhập
  incomeLight: '#81C784',

  expense: '#F44336',        // Đỏ – chi tiêu
  expenseLight: '#E57373',

  accent: '#64B5F6',         // Xanh dương nhạt – điểm nhấn phụ
  warning: '#FFC107',

  background: '#E3F2FD',     // Nền xanh dương rất nhạt
  surface: '#FFFFFF',

  textPrimary: '#212121',
  textSecondary: '#757575',

  border: '#90CAF9',         // Viền xanh nhạt
};


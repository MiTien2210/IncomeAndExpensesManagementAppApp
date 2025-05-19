import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamList, Transaction} from '../types/types';
import {TransactionContext} from '../context/TransactionContext'; // Context lấy transactions
import {PieChart} from 'react-native-chart-kit';

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
  const {transactions} = useContext(TransactionContext);
  console.log("transactions:::",transactions);
  


  const [chartData, setChartData] = useState<CategoryData[]>([]);
  const [showIncomeChart, setShowIncomeChart] = useState(false); // false = chi tiêu, true = thu nhập
  const [useParentCategory, setUseParentCategory] = useState(false); // false = danh mục con, true = danh mục cha

  const navigation = useNavigation<NavigationProp>();

  // Hàm sinh màu ngẫu nhiên nếu category không có màu
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Tính dữ liệu chart tổng hợp theo loại (income/expense) và danh mục (con/cha)
  const calculateChartData = (
    transactions: Transaction[],
    type: 'income' | 'expense',
  ): CategoryData[] => {
    const filtered = transactions.filter(t => t.type === type);

    const sums: {[key: string]: {amount: number; color: string}} = {};

    filtered.forEach(item => {
      // lấy key và color dựa trên useParentCategory (giá trị từ ngoài hàm)
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
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));
  };

  // Cập nhật chartData khi transactions hoặc các option thay đổi
  useEffect(() => {
    const type = showIncomeChart ? 'income' : 'expense';
    const data = calculateChartData(transactions, type);
    setChartData(data);
  }, [transactions, showIncomeChart, useParentCategory]);

  const totalAmount = chartData.reduce((acc, item) => acc + item.amount, 0);

  // Khi nhấn vào danh mục, chuyển màn hình hiển thị chi tiết
  const handleCategoryPress = (categoryName: string) => {
    navigation.navigate('TransactionListByCategory', {
      categoryName,
      type: showIncomeChart ? 'income' : 'expense',
      isParent: useParentCategory,
    });
  };

  return (
    <View style={styles.container}>
      {/* Nút chọn Chi tiêu / Thu nhập */}
      <View style={styles.buttonContainer}>
        <Button
          title="Chi Tiêu"
          onPress={() => setShowIncomeChart(false)}
          color={showIncomeChart ? 'gray' : '#6200ee'}
        />
        <Button
          title="Thu Nhập"
          onPress={() => setShowIncomeChart(true)}
          color={showIncomeChart ? '#6200ee' : 'gray'}
        />
      </View>

      {/* Tổng số tiền */}
      <View style={styles.summaryContainer}>
        <Text style={styles.text}>
          Tổng {showIncomeChart ? 'thu nhập' : 'chi tiêu'}: {totalAmount}₫
        </Text>
      </View>

      {/* Tiêu đề biểu đồ */}
      <Text style={styles.header}>
        Biểu đồ {showIncomeChart ? 'thu nhập' : 'chi tiêu'} theo{' '}
        {useParentCategory ? 'danh mục cha' : 'danh mục con'}
      </Text>

      {/* Biểu đồ tròn */}
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
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
          center={[10, 10]}
          absolute
        />
      ) : (
        <Text style={styles.text}>Không có dữ liệu</Text>
      )}

      {/* Nút chuyển danh mục con / cha */}
      <View style={styles.buttonContainer}>
        <Button
          title="Danh mục con"
          onPress={() => setUseParentCategory(false)}
          color={useParentCategory ? 'gray' : '#009688'}
        />
        <Button
          title="Danh mục cha"
          onPress={() => setUseParentCategory(true)}
          color={useParentCategory ? '#009688' : 'gray'}
        />
      </View>

      {/* Danh sách danh mục */}
      <Text style={styles.listHeader}>Chi tiết danh mục:</Text>
      <FlatList
        data={chartData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleCategoryPress(item.name)}>
            <View style={[styles.colorBox, {backgroundColor: item.color}]} />
            <View style={styles.listItemText}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.amountText}>{item.amount}₫</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  header: {fontSize: 20, fontWeight: '600', marginVertical: 16},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  summaryContainer: {marginTop: 20},
  text: {fontSize: 16, marginVertical: 4},
  listHeader: {marginTop: 16, fontSize: 18, fontWeight: '500'},
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  colorBox: {width: 16, height: 16, borderRadius: 4, marginRight: 12},
  listItemText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  categoryName: {fontSize: 16},
  amountText: {fontSize: 16, fontWeight: 'bold'},
});

export default OverviewScreen;

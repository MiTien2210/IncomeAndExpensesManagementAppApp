import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpenseListScreen from './screens/ExpenseListScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ExpenseDetailScreen from './screens/ExpenseDetailScreen';
import ExpenseStatisticsScreen from './screens/ExpenseStatisticsScreen';
import { RootStackParamList } from './types';
import { ExpenseProvider } from './context/ExpenseContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ExpenseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ExpenseList">
          <Stack.Screen name="ExpenseList" component={ExpenseListScreen} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
          <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
          <Stack.Screen name="ExpenseStatistics" component={ExpenseStatisticsScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </ExpenseProvider>
  );
}


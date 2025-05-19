// AppNavigator.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import TransactionDetailScreen from './screens/TransactionDetailScreen';
import TransactionListByCategoryScreen from './screens/TransactionListByCategoryScreen';
import {ParamList} from './types/types';
import EditTransactionScreen from './screens/EditTransactionScreen';

const Stack = createNativeStackNavigator<ParamList>();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Tabs"
      component={TabNavigator}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="TransactionDetail"
      component={TransactionDetailScreen}
      options={{title: 'Chi tiết giao dịch'}}
    />
    <Stack.Screen
      name="TransactionListByCategory"
      component={TransactionListByCategoryScreen}
      options={{title: 'Danh sách giao dịch'}}
    />

    <Stack.Screen name="EditTransaction" component={EditTransactionScreen} />
  </Stack.Navigator>
);

export default AppNavigator;

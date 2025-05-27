// AppNavigator.tsx
import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import TransactionDetailScreen from './screens/TransactionDetailScreen';
import TransactionListByCategoryScreen from './screens/TransactionListByCategoryScreen';
import {ParamList} from './types/types';
import EditTransactionScreen from './screens/EditTransactionScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import {UserContext} from './context/UserContext';

const Stack = createNativeStackNavigator<ParamList>();

const AppNavigator = () => {
  const {user} = useContext(UserContext);
  console.log('user:', user);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen
            name="TransactionDetail"
            component={TransactionDetailScreen}
            options={{title: 'Chi tiết giao dịch', headerShown: true}}
          />
          <Stack.Screen
            name="TransactionListByCategory"
            component={TransactionListByCategoryScreen}
            options={{title: 'Danh sách giao dịch', headerShown: true}}
          />
          <Stack.Screen
            name="EditTransaction"
            component={EditTransactionScreen}
            options={{title: 'Chỉnh sửa giao dịch', headerShown: true}}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'Đăng nhập'}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{title: 'Đăng ký'}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

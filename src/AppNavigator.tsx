import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OverviewScreen from './screens/OverviewScreen';
import TransactionListScreen from './screens/TransactionListScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({color, size}) => {
        let iconName = '';

        if (route.name === 'Tổng quan') {
          iconName = 'dashboard';
        } else if (route.name === 'Sổ giao dịch') {
          iconName = 'receipt';
        } else if (route.name === 'Ghi chép giao dịch') {
          iconName = 'add-circle-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
    })}>
    <Tab.Screen name="Tổng quan" component={OverviewScreen} />
    <Tab.Screen name="Sổ giao dịch" component={TransactionListScreen} />
    <Tab.Screen name="Ghi chép giao dịch" component={AddTransactionScreen} />
  </Tab.Navigator>
);

export default AppNavigator;

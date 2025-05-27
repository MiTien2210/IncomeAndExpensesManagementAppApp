// TabNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OverviewScreen from './screens/OverviewScreen';
import TransactionListScreen from './screens/TransactionListScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AboutScreen from './screens/AboutScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
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
        } else if (route.name === 'Tôi') {
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
    <Tab.Screen name="Tôi" component={AboutScreen} />
  </Tab.Navigator>
);

export default TabNavigator;

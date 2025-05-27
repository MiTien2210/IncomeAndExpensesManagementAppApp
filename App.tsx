import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/AppNavigator';
import {TransactionProvider} from './src/context/TransactionContext';
import {UserProvider} from './src/context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <TransactionProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TransactionProvider>
    </UserProvider>
  );
}

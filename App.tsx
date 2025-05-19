import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/AppNavigator';
import {TransactionProvider} from './src/context/TransactionContext';

export default function App() {
  return (
    <TransactionProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </TransactionProvider>
  );
}

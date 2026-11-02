import React from 'react';
import { AppDataProvider } from './src/context/AppDataContext';
import { SyncProvider } from './src/context/SyncContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AppDataProvider>
      <SyncProvider>
        <AppNavigator />
      </SyncProvider>
    </AppDataProvider>
  );
}

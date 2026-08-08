import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './ThemeProvider';

export interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <SafeAreaProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </SafeAreaProvider>
);

export default AppProviders;

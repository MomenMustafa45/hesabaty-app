import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from '@lib/queryClient';
import '@lib/db';
import { ThemeProvider } from './ThemeProvider';

export interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <SafeAreaProvider>
    <KeyboardProvider preload={false}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </KeyboardProvider>
  </SafeAreaProvider>
);

export default AppProviders;

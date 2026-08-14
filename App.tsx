/**
 * حساباتي
 *
 * @format
 */
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashGate from '@features/splash/SplashGate';
import AppProviders from '@providers/AppProviders';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <SplashGate />
      </AppProviders>
    </GestureHandlerRootView>
  );
}

export default App;

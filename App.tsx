/**
 * حساباتي — Milestone 1
 *
 * Temporarily boots straight into the design-system gallery screen so every
 * component/variant can be checked against the prototype. Real navigation
 * (RootNavigator/AppProviders) starts in M2.
 *
 * @format
 */
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GalleryScreen from './GalleryScreen';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <GalleryScreen />
    </SafeAreaProvider>
  );
}

export default App;

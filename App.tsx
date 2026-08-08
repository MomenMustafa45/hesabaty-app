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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GalleryScreen from './GalleryScreen';

function App(): React.JSX.Element {
  return (
    // TODO(M2): this wraps the temporary gallery root only. When real
    // navigation (RootNavigator/AppProviders) replaces GalleryScreen, move
    // this GestureHandlerRootView to wrap the permanent app root instead.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GalleryScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

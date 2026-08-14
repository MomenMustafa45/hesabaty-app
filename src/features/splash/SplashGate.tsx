import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import RootNavigator from '@navigations/RootNavigator';
import { splashColors } from '@features/splash/splashConstants';
import { useSettingsStore } from '@store/settingsStore';
import SplashContinuationScreen from './screens/SplashContinuationScreen/SplashContinuationScreen';

/**
 * Layer 1: native bootsplash until MMKV hydrates.
 * Layer 2: animated splash on top; app mounts underneath during exit fade (no gap).
 */
export const SplashGate: React.FC = () => {
  const [hasHydrated, setHasHydrated] = useState(
    useSettingsStore.persist.hasHydrated(),
  );
  const [appMounted, setAppMounted] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    const unsubscribe = useSettingsStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    setHasHydrated(useSettingsStore.persist.hasHydrated());
    return unsubscribe;
  }, []);

  const handleExitFadeStart = useCallback(() => {
    setAppMounted(true);
  }, []);

  const handleSplashFinished = useCallback(() => {
    setOverlayVisible(false);
  }, []);

  if (!hasHydrated) {
    return null;
  }

  return (
    <View style={styles.root}>
      {appMounted ? (
        <View style={styles.appLayer}>
          <RootNavigator />
        </View>
      ) : null}
      {overlayVisible ? (
        <View style={styles.overlay} pointerEvents="box-none">
          <SplashContinuationScreen
            onExitFadeStart={handleExitFadeStart}
            onFinished={handleSplashFinished}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: splashColors.bgDeep,
  },
  appLayer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
});

export default SplashGate;

import React, { useEffect, useRef } from 'react';
import { useWindowDimensions, View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MintStrikeHero from '@features/splash/components/MintStrikeHero';
import SplashRadialBackground from '@features/splash/components/SplashRadialBackground';
import { scheduleAfterFirstPaint } from '@features/splash/scheduleAfterFirstPaint';
import {
  SPLASH_ANIMATION_MS,
  SPLASH_EXIT_DELAY_MS,
  SPLASH_EXIT_FADE_MS,
} from '@features/splash/splashConstants';
import { localizationKeys } from '@locales/localizationKeys';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './SplashContinuationScreen.styles';

export interface SplashContinuationScreenProps {
  /** Fired when exit fade begins — mount main app under this overlay. */
  onExitFadeStart: () => void;
  onFinished: () => void;
}

export const SplashContinuationScreen: React.FC<
  SplashContinuationScreenProps
> = ({ onExitFadeStart, onFinished }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);
  const exitOpacity = useSharedValue(1);
  const didHideNativeSplash = useRef(false);
  const didNotifyExitStart = useRef(false);

  const hideNativeBootSplash = () => {
    if (didHideNativeSplash.current) {
      return;
    }
    didHideNativeSplash.current = true;

    scheduleAfterFirstPaint(() => {
      void RNBootSplash.hide({ fade: false });
    });
  };

  const handleLayout = () => {
    hideNativeBootSplash();
  };

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: SPLASH_ANIMATION_MS,
      easing: Easing.linear,
    });

    const exitAt = SPLASH_ANIMATION_MS + SPLASH_EXIT_DELAY_MS;
    const fadeTimer = setTimeout(() => {
      if (!didNotifyExitStart.current) {
        didNotifyExitStart.current = true;
        onExitFadeStart();
      }
      exitOpacity.value = withTiming(0, { duration: SPLASH_EXIT_FADE_MS });
    }, exitAt);

    const finishTimer = setTimeout(() => {
      onFinished();
    }, exitAt + SPLASH_EXIT_FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [exitOpacity, onExitFadeStart, onFinished, progress]);

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.44, 0.62, 1],
      [0, 0, 1, 1],
    );
    const translateY = interpolate(
      progress.value,
      [0, 0.44, 0.62, 1],
      [16, 16, 0, 0],
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const rootFadeStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
  }));

  return (
    <Animated.View style={[styles.root, rootFadeStyle]} onLayout={handleLayout}>
      <SplashRadialBackground width={width} height={height} />

      <View style={[styles.content, { paddingTop: insets.top }]}>
        <MintStrikeHero progress={progress} />
        <Animated.View style={[styles.titleBlock, titleStyle]}>
          <Animated.Text style={styles.title}>
            {t(localizationKeys.appName)}
          </Animated.Text>
          <View style={styles.rule} />
          <Animated.Text style={styles.tagline}>
            {t(localizationKeys.splashTagline)}
          </Animated.Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default SplashContinuationScreen;

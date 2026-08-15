import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, PressableProps } from 'react-native';
import { scale } from '@config/scaling';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AppToggle.styles';
import { useSettingsStore } from '@store/settingsStore';

export interface AppToggleProps
  extends Omit<PressableProps, 'style' | 'onPress'> {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const KNOB_TRAVEL_DISTANCE = scale(18);

export const AppToggle: React.FC<AppToggleProps> = ({
  value,
  onValueChange,
  ...rest
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const translateX = useRef(new Animated.Value(value ? 1 : 0)).current;
  const { language } = useSettingsStore();

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  const direction = language === 'ar' ? -1 : 1;
  const knobTranslateX = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, KNOB_TRAVEL_DISTANCE * direction],
  });

  return (
    <Pressable
      style={[styles.track, value && styles.trackOn]}
      onPress={() => onValueChange(!value)}
      {...rest}
    >
      <Animated.View
        style={[styles.knob, { transform: [{ translateX: knobTranslateX }] }]}
      />
    </Pressable>
  );
};

export default AppToggle;

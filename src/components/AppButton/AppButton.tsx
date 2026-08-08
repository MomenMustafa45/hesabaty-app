import React from 'react';
import { Pressable, PressableProps, StyleProp, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AppButton.styles';

export interface AppButtonProps extends Omit<PressableProps, 'style'> {
  variant?: 'primary' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  leadingIcon,
  children,
  style,
  ...rest
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        isPrimary ? styles.primary : styles.ghost,
        isPrimary && pressed && styles.primaryPressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}>
      {leadingIcon ? <View>{leadingIcon}</View> : null}
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.ghostLabel]}>
        {children}
      </Text>
    </Pressable>
  );
};

export default AppButton;

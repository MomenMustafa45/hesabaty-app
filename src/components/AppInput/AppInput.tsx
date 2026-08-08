import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AppInput.styles';

export type AppInputType = 'text' | 'number';

export interface AppInputProps extends Omit<TextInputProps, 'style'> {
  type?: AppInputType;
  label?: string;
  containerStyle?: View['props']['style'];
}

const keyboardTypeByInputType: Record<AppInputType, TextInputProps['keyboardType']> = {
  text: 'default',
  number: 'numeric',
};

export const AppInput: React.FC<AppInputProps> = ({
  type = 'text',
  label,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus: TextInputProps['onFocus'] = event => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: TextInputProps['onBlur'] = event => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        keyboardType={keyboardTypeByInputType[type]}
        placeholderTextColor={theme.colors.ink3}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
    </View>
  );
};

export default AppInput;

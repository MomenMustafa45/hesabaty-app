import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AppSegmentedControl.styles';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface AppSegmentedControlProps<T extends string> {
  options: [SegmentedOption<T>, SegmentedOption<T>];
  value: T;
  onChange: (value: T) => void;
}

export function AppSegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: AppSegmentedControlProps<T>) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.track}>
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => onChange(option.value)}>
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default AppSegmentedControl;

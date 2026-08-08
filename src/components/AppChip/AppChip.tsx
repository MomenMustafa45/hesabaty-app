import React from 'react';
import { Pressable, PressableProps, Text, View } from 'react-native';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AppChip.styles';

export interface AppChipProps extends Omit<PressableProps, 'style'> {
  selected?: boolean;
  dotColor?: string;
  children?: React.ReactNode;
}

export const AppChip: React.FC<AppChipProps> = ({
  selected = false,
  dotColor,
  children,
  ...rest
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Pressable style={[styles.chip, selected && styles.selected]} {...rest}>
      {dotColor ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      <Text style={[styles.label, selected && styles.labelSelected]}>{children}</Text>
    </Pressable>
  );
};

export default AppChip;

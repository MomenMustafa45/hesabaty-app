import React from 'react';
import { View } from 'react-native';
import AppText from '@components/AppText';
import AppToggle from '@components/AppToggle';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './RepeatToggle.styles';

export interface RepeatToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const RepeatToggle: React.FC<RepeatToggleProps> = ({
  value,
  onValueChange,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <AppText weight={600}>Repeat monthly</AppText>
        <AppText variant="tiny">
          Auto-fills this category & amount next cycle
        </AppText>
      </View>
      <AppToggle value={value} onValueChange={onValueChange} />
    </View>
  );
};

export default RepeatToggle;

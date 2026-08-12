import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppText from '@components/AppText';
import AppToggle from '@components/AppToggle';
import { localizationKeys } from '@locales/localizationKeys';
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
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <AppText weight={600}>{t(localizationKeys.repeatMonthly)}</AppText>
        <AppText variant="tiny">{t(localizationKeys.repeatSub)}</AppText>
      </View>
      <AppToggle value={value} onValueChange={onValueChange} />
    </View>
  );
};

export default RepeatToggle;

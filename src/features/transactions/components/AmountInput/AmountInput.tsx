import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { localizationKeys } from '@locales/localizationKeys';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AmountInput.styles';

export interface AmountInputProps {
  value: string;
  onChangeText: (value: string) => void;
  currencyCode: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChangeText,
  currencyCode,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={theme.colors.ink3}
        accessibilityLabel={t(localizationKeys.amount)}
      />
      <Text style={styles.currencyCode}>{currencyCode}</Text>
    </View>
  );
};

export default AmountInput;

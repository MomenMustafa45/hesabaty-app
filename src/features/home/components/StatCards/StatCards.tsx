import React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppText from '@components/AppText';
import { useCurrency } from '@hooks/useCurrency';
import { localizationKeys } from '@locales/localizationKeys';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './StatCards.styles';

export type StatCardsProps =
  | {
      variant?: 'home';
      totalIncome: number;
      net: number;
    }
  | {
      variant: 'month';
      totalSpend: number;
      totalIncome: number;
    };

export const StatCards: React.FC<StatCardsProps> = props => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const { formatMoney } = useCurrency();

  if (props.variant === 'month') {
    return (
      <View style={styles.grid}>
        <View style={styles.card}>
          <AppText variant="tiny">{t(localizationKeys.totalSpent)}</AppText>
          <Text style={[styles.value, { color: theme.colors.coral }]}>
            {formatMoney(props.totalSpend)}
          </Text>
        </View>
        <View style={styles.card}>
          <AppText variant="tiny">{t(localizationKeys.totalIncome)}</AppText>
          <Text style={[styles.value, { color: theme.colors.nile }]}>
            {formatMoney(props.totalIncome)}
          </Text>
        </View>
      </View>
    );
  }

  const netColor = props.net >= 0 ? theme.colors.nile : theme.colors.coral;

  return (
    <View style={styles.grid}>
      <View style={styles.card}>
        <AppText variant="tiny">{t(localizationKeys.income)}</AppText>
        <Text style={[styles.value, { color: theme.colors.nile }]}>
          {formatMoney(props.totalIncome)}
        </Text>
      </View>
      <View style={styles.card}>
        <AppText variant="tiny">{t(localizationKeys.netBalance)}</AppText>
        <Text style={[styles.value, { color: netColor }]}>
          {formatMoney(props.net)}
        </Text>
      </View>
    </View>
  );
};

export default StatCards;

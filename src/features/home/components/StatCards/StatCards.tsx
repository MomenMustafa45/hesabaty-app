import React from 'react';
import { Text, View } from 'react-native';
import AppText from '@components/AppText';
import { useCurrency } from '@hooks/useCurrency';
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
  const { formatMoney } = useCurrency();

  if (props.variant === 'month') {
    return (
      <View style={styles.grid}>
        <View style={styles.card}>
          <AppText variant="tiny">Total spent</AppText>
          <Text style={[styles.value, { color: theme.colors.coral }]}>
            {formatMoney(props.totalSpend)}
          </Text>
        </View>
        <View style={styles.card}>
          <AppText variant="tiny">Total income</AppText>
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
        <AppText variant="tiny">Income</AppText>
        <Text style={[styles.value, { color: theme.colors.nile }]}>
          {formatMoney(props.totalIncome)}
        </Text>
      </View>
      <View style={styles.card}>
        <AppText variant="tiny">Net balance</AppText>
        <Text style={[styles.value, { color: netColor }]}>
          {formatMoney(props.net)}
        </Text>
      </View>
    </View>
  );
};

export default StatCards;

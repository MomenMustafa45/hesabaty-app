import React from 'react';
import { Text, View } from 'react-native';
import AppText from '@components/AppText';
import { useCurrency } from '@hooks/useCurrency';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './StatCards.styles';

export interface StatCardsProps {
  totalIncome: number;
  net: number;
}

export const StatCards: React.FC<StatCardsProps> = ({ totalIncome, net }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { formatMoney } = useCurrency();
  const netColor = net >= 0 ? theme.colors.nile : theme.colors.coral;

  return (
    <View style={styles.grid}>
      <View style={styles.card}>
        <AppText variant="tiny">Income</AppText>
        <Text style={[styles.value, { color: theme.colors.nile }]}>
          {formatMoney(totalIncome)}
        </Text>
      </View>
      <View style={styles.card}>
        <AppText variant="tiny">Net balance</AppText>
        <Text style={[styles.value, { color: netColor }]}>
          {formatMoney(net)}
        </Text>
      </View>
    </View>
  );
};

export default StatCards;

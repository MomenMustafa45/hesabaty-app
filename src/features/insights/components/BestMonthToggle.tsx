import React from 'react';
import { Pressable, View } from 'react-native';
import AppText from '@components/AppText';
import { BestMonthMetric } from '@store/bestMonthMetricStore';
import { useCurrency } from '@hooks/useCurrency';
import { formatMonthLabel } from '@lib/dateUtils';
import { MonthStat } from '@features/insights/hooks/useMonthlyStats';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './BestMonthToggle.styles';

export interface BestMonthToggleProps {
  metric: BestMonthMetric;
  onChangeMetric: (metric: BestMonthMetric) => void;
  bestStat: MonthStat | null;
}

export const BestMonthToggle: React.FC<BestMonthToggleProps> = ({
  metric,
  onChangeMetric,
  bestStat,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { formatMoney } = useCurrency();

  const handleSelectSpend = () => onChangeMetric('spend');
  const handleSelectSavings = () => onChangeMetric('savings');

  const resultCaption = bestStat
    ? metric === 'spend'
      ? `${formatMoney(bestStat.totalSpend)} total spent`
      : `${formatMoney(bestStat.net)} saved`
    : null;

  return (
    <View>
      <View style={styles.toggle}>
        <Pressable
          style={[styles.toggleBtn, metric === 'spend' && styles.toggleBtnActive]}
          onPress={handleSelectSpend}
          accessibilityRole="button"
          accessibilityLabel="Lowest spend">
          <AppText
            variant="tiny"
            weight={600}
            color={metric === 'spend' ? 'goldText' : 'ink2'}>
            Lowest spend
          </AppText>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, metric === 'savings' && styles.toggleBtnActive]}
          onPress={handleSelectSavings}
          accessibilityRole="button"
          accessibilityLabel="Highest savings">
          <AppText
            variant="tiny"
            weight={600}
            color={metric === 'savings' ? 'goldText' : 'ink2'}>
            Highest savings
          </AppText>
        </Pressable>
      </View>

      {bestStat ? (
        <View style={styles.card}>
          <View style={styles.mark}>
            <AppText weight={700} style={styles.markText}>
              ★
            </AppText>
          </View>
          <View>
            <AppText weight={700}>{formatMonthLabel(bestStat.key)}</AppText>
            <AppText variant="tiny">{resultCaption}</AppText>
          </View>
        </View>
      ) : null}

      <AppText variant="tiny" style={styles.caption}>
        Based on completed months only
      </AppText>
    </View>
  );
};

export default BestMonthToggle;

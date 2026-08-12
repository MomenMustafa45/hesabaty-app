import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppText from '@components/AppText';
import { BestMonthMetric } from '@store/bestMonthMetricStore';
import { useCurrency } from '@hooks/useCurrency';
import { formatMonthLabel, localeForLanguage } from '@lib/dateUtils';
import { localizationKeys } from '@locales/localizationKeys';
import { MonthStat } from '@features/insights/hooks/useMonthlyStats';
import { useSettingsStore } from '@store/settingsStore';
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
  const { t } = useTranslation();
  const { formatMoney } = useCurrency();
  const language = useSettingsStore(state => state.language);
  const locale = localeForLanguage(language);

  const handleSelectSpend = () => onChangeMetric('spend');
  const handleSelectSavings = () => onChangeMetric('savings');

  const resultCaption = bestStat
    ? metric === 'spend'
      ? t(localizationKeys.bestSpendResult, {
          amount: formatMoney(bestStat.totalSpend),
        })
      : t(localizationKeys.bestSavedResult, {
          amount: formatMoney(bestStat.net),
        })
    : null;

  return (
    <View>
      <View style={styles.toggle}>
        <Pressable
          style={[styles.toggleBtn, metric === 'spend' && styles.toggleBtnActive]}
          onPress={handleSelectSpend}
          accessibilityRole="button"
          accessibilityLabel={t(localizationKeys.lowestSpend)}>
          <AppText
            variant="tiny"
            weight={600}
            color={metric === 'spend' ? 'goldText' : 'ink2'}>
            {t(localizationKeys.lowestSpend)}
          </AppText>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, metric === 'savings' && styles.toggleBtnActive]}
          onPress={handleSelectSavings}
          accessibilityRole="button"
          accessibilityLabel={t(localizationKeys.highestSavings)}>
          <AppText
            variant="tiny"
            weight={600}
            color={metric === 'savings' ? 'goldText' : 'ink2'}>
            {t(localizationKeys.highestSavings)}
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
            <AppText weight={700}>
              {formatMonthLabel(bestStat.key, locale)}
            </AppText>
            <AppText variant="tiny">{resultCaption}</AppText>
          </View>
        </View>
      ) : null}

      <AppText variant="tiny" style={styles.caption}>
        {t(localizationKeys.completedOnly)}
      </AppText>
    </View>
  );
};

export default BestMonthToggle;

import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '@components/AppText';
import { useCategories } from '@features/categories/hooks/useCategories';
import { BestMonthToggle } from '@features/insights/components/BestMonthToggle';
import { CategoryDonut, CategoryDonutSegment } from '@features/insights/components/CategoryDonut';
import { MonthlyBarChart } from '@features/insights/components/MonthlyBarChart';
import { useBestMonth } from '@features/insights/hooks/useBestMonth';
import { useMonthlyStats } from '@features/insights/hooks/useMonthlyStats';
import { useTransactions } from '@features/transactions/hooks/useTransactions';
import { localizationKeys } from '@locales/localizationKeys';
import { useSettingsStore } from '@store/settingsStore';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './InsightsScreen.styles';

export const InsightsScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const language = useSettingsStore(state => state.language);

  const { stats, currentMonthKey } = useMonthlyStats();
  const { bestKey, bestStat, metric, setMetric } = useBestMonth();
  const { data: transactions = [] } = useTransactions();
  const { data: categories = [] } = useCategories();

  const latestMonthKey = stats[stats.length - 1]?.key ?? currentMonthKey;

  const categorySegments = useMemo((): CategoryDonutSegment[] => {
    const totalsByCategory = new Map<string, number>();
    for (const transaction of transactions) {
      if (
        transaction.type !== 'expense' ||
        transaction.date.slice(0, 7) !== latestMonthKey
      ) {
        continue;
      }
      totalsByCategory.set(
        transaction.categoryId,
        (totalsByCategory.get(transaction.categoryId) ?? 0) + transaction.amount,
      );
    }

    const total = Array.from(totalsByCategory.values()).reduce(
      (sum, amount) => sum + amount,
      0,
    );
    if (total === 0) {
      return [];
    }

    const categoriesById = new Map(categories.map(category => [category.id, category]));

    return Array.from(totalsByCategory.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([categoryId, amount]) => {
        const category = categoriesById.get(categoryId);
        return {
          id: categoryId,
          label: category
            ? language === 'ar'
              ? category.labelAr
              : category.labelEn
            : t(localizationKeys.unknown),
          color: category?.color ?? theme.colors.ink3,
          amount,
          pct: amount / total,
        };
      });
  }, [
    transactions,
    categories,
    latestMonthKey,
    language,
    theme.colors.ink3,
    t,
  ]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        showsVerticalScrollIndicator={false}>
        <AppText variant="h1" style={styles.title}>
          {t(localizationKeys.insights)}
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          {t(localizationKeys.monthlyTrend)}
        </AppText>
        <MonthlyBarChart
          stats={stats}
          currentMonthKey={currentMonthKey}
          bestMonthKey={bestKey}
        />

        <AppText variant="h3" style={styles.sectionTitle}>
          {t(localizationKeys.bestMonth)}
        </AppText>
        <BestMonthToggle
          metric={metric}
          onChangeMetric={setMetric}
          bestStat={bestStat}
        />

        <AppText variant="h3" style={styles.sectionTitle}>
          {t(localizationKeys.byCategory)}
        </AppText>
        <CategoryDonut segments={categorySegments} />
      </ScrollView>
    </View>
  );
};

export default InsightsScreen;

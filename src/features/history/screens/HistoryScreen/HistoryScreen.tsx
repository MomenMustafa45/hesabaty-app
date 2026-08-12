import React, { useEffect, useMemo, useState } from 'react';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import EmptyState from '@components/EmptyState';
import { useCategories } from '@features/categories/hooks/useCategories';
import { useAvailableMonths } from '@features/history/hooks/useAvailableMonths';
import { useMonthStats } from '@features/history/hooks/useMonthStats';
import { useMonthTransactions } from '@features/history/hooks/useMonthTransactions';
import { StatCards } from '@features/home/components/StatCards';
import { TransactionRow } from '@features/transactions/components/TransactionRow';
import {
  formatMonthLabel,
  localeForLanguage,
  toYearMonthKey,
} from '@lib/dateUtils';
import { localizationKeys } from '@locales/localizationKeys';
import { Category } from '@models/category';
import { useSettingsStore } from '@store/settingsStore';
import { useTransactionSheetStore } from '@store/transactionSheetStore';
import { useTheme } from '@providers/ThemeProvider';
import { MonthPickerSheet } from '../MonthPickerSheet';
import { createStyles } from './HistoryScreen.styles';

function categoryLabel(
  category: Category | undefined,
  language: string,
  unknownLabel: string,
): string {
  if (!category) {
    return unknownLabel;
  }
  return language === 'ar' ? category.labelAr : category.labelEn;
}

function formatRowDate(isoDate: string, locale: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  });
}

export const HistoryScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const language = useSettingsStore(state => state.language);
  const locale = localeForLanguage(language);
  const openEdit = useTransactionSheetStore(state => state.openEdit);
  const { data: categories = [] } = useCategories();
  const { months, isLoading: monthsLoading } = useAvailableMonths();

  const [monthKey, setMonthKey] = useState(() => toYearMonthKey(new Date()));
  const [pickerOpen, setPickerOpen] = useState(false);

  const monthIndex = months.indexOf(monthKey);
  const canGoPrev = monthIndex > 0;
  const canGoNext = monthIndex >= 0 && monthIndex < months.length - 1;

  const stats = useMonthStats(monthKey);
  const { groups, transactions } = useMonthTransactions(monthKey);

  useEffect(() => {
    if (monthsLoading || months.length === 0) {
      return;
    }
    if (!months.includes(monthKey)) {
      setMonthKey(months[months.length - 1]);
    }
  }, [months, monthKey, monthsLoading]);

  const categoriesById = useMemo(() => {
    const map = new Map<string, Category>();
    for (const category of categories) {
      map.set(category.id, category);
    }
    return map;
  }, [categories]);

  const monthLabel = formatMonthLabel(monthKey, locale);
  const isRtl = I18nManager.isRTL;
  const prevIcon = isRtl ? 'chevronRight' : 'chevronLeft';
  const nextIcon = isRtl ? 'chevronLeft' : 'chevronRight';

  const handlePrev = () => {
    if (!canGoPrev) {
      return;
    }
    setMonthKey(months[monthIndex - 1]);
  };

  const handleNext = () => {
    if (!canGoNext) {
      return;
    }
    setMonthKey(months[monthIndex + 1]);
  };

  const handleOpenPicker = () => {
    setPickerOpen(true);
  };

  const handleClosePicker = () => {
    setPickerOpen(false);
  };

  const handleSelectMonth = (key: string) => {
    setMonthKey(key);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 4 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            style={[styles.iconBtn, !canGoPrev && styles.iconBtnDisabled]}
            onPress={handlePrev}
            disabled={!canGoPrev}
            accessibilityRole="button"
            accessibilityLabel={t(localizationKeys.prevMonth)}>
            <AppIcon name={prevIcon} size={16} color={theme.colors.ink} />
          </Pressable>

          <Pressable
            style={styles.monthBtn}
            onPress={handleOpenPicker}
            accessibilityRole="button"
            accessibilityLabel={t(localizationKeys.selectMonth)}>
            <AppText variant="h2">{monthLabel}</AppText>
            <AppIcon name="chevDown" size={15} color={theme.colors.ink} />
          </Pressable>

          <Pressable
            style={[styles.iconBtn, !canGoNext && styles.iconBtnDisabled]}
            onPress={handleNext}
            disabled={!canGoNext}
            accessibilityRole="button"
            accessibilityLabel={t(localizationKeys.nextMonth)}>
            <AppIcon name={nextIcon} size={16} color={theme.colors.ink} />
          </Pressable>
        </View>

        <StatCards
          variant="month"
          totalSpend={stats.totalSpend}
          totalIncome={stats.totalIncome}
        />

        {transactions.length === 0 ? (
          <EmptyState
            icon="wallet"
            title={t(localizationKeys.noTxnsTitle)}
            subtitle={t(localizationKeys.noTxnsSub)}
          />
        ) : (
          groups.map(group => (
            <View key={group.date} style={styles.dayGroup}>
              <AppText variant="tiny" weight={600} style={styles.dayLabel}>
                {group.label}
              </AppText>
              <View style={styles.dayCard}>
                {group.transactions.map((transaction, index) => {
                  const category = categoriesById.get(transaction.categoryId);
                  const dateStr = formatRowDate(transaction.date, locale);
                  const subline = transaction.description
                    ? `${transaction.description} · ${dateStr}`
                    : dateStr;

                  return (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      categoryLabel={categoryLabel(
                        category,
                        language,
                        t(localizationKeys.unknown),
                      )}
                      categoryColor={category?.color ?? theme.colors.ink3}
                      subline={subline}
                      isLast={index === group.transactions.length - 1}
                      onPress={() => openEdit(transaction)}
                    />
                  );
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <MonthPickerSheet
        visible={pickerOpen}
        onClose={handleClosePicker}
        months={months}
        selectedMonthKey={monthKey}
        onSelectMonth={handleSelectMonth}
      />
    </View>
  );
};

export default HistoryScreen;

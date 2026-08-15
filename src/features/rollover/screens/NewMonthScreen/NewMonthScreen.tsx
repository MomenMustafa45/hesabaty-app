import React, { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppCard from '@components/AppCard';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import { useCategories } from '@features/categories/hooks/useCategories';
import {
  pendingRecurringKey,
  usePendingRecurring,
} from '@features/rollover/hooks/usePendingRecurring';
import { useAddTransaction } from '@features/transactions/hooks/useAddTransaction';
import { useTransactions } from '@features/transactions/hooks/useTransactions';
import { useCurrency } from '@hooks/useCurrency';
import {
  formatMonthLabel,
  localeForLanguage,
  toIsoDate,
  toYearMonthKey,
} from '@lib/dateUtils';
import { localizationKeys } from '@locales/localizationKeys';
import { Transaction } from '@models/transaction';
import { useTheme } from '@providers/ThemeProvider';
import { useRolloverStore } from '@store/rolloverStore';
import { useSettingsStore } from '@store/settingsStore';
import { useTransactionSheetStore } from '@store/transactionSheetStore';
import { createStyles } from './NewMonthScreen.styles';

export interface NewMonthScreenProps {
  onDismiss: () => void;
}

export const NewMonthScreen: React.FC<NewMonthScreenProps> = ({
  onDismiss,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { formatMoney } = useCurrency();
  const language = useSettingsStore(state => state.language);
  const monthlyLimit = useSettingsStore(state => state.monthlyLimit);
  const { pending, previousCycle } = usePendingRecurring();
  const { data: categories = [] } = useCategories();
  const { data: previousTxns = [] } = useTransactions({
    dateFrom: toIsoDate(previousCycle.start),
    dateTo: toIsoDate(previousCycle.end),
  });
  const addMutation = useAddTransaction();
  const dismissPendingKey = useRolloverStore(state => state.dismissPendingKey);
  const openPrefill = useTransactionSheetStore(state => state.openPrefill);

  const categoriesById = useMemo(
    () => new Map(categories.map(category => [category.id, category])),
    [categories],
  );

  const previousSpend = useMemo(
    () =>
      previousTxns
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    [previousTxns],
  );

  const overLimit =
    monthlyLimit != null && monthlyLimit > 0 && previousSpend > monthlyLimit;
  const previousLabel = formatMonthLabel(
    toYearMonthKey(previousCycle.start),
    localeForLanguage(language),
  );

  const handleConfirm = async (transaction: Transaction) => {
    const key = pendingRecurringKey(transaction);
    await addMutation.mutateAsync({
      type: transaction.type,
      categoryId: transaction.categoryId,
      amount: transaction.amount,
      description: transaction.description,
      date: toIsoDate(new Date()),
      recurring: true,
    });
    dismissPendingKey(key);
  };

  const handleEdit = (transaction: Transaction) => {
    openPrefill({
      type: transaction.type,
      categoryId: transaction.categoryId,
      amount: transaction.amount,
      description: transaction.description,
      recurring: true,
      rolloverKey: pendingRecurringKey(transaction),
    });
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel={t(localizationKeys.back)}
          >
            <AppIcon
              name={language === 'ar' ? 'chevronRight' : 'chevronLeft'}
              size={16}
              color={theme.colors.ink}
            />
          </Pressable>
          <AppText variant="h2">{t(localizationKeys.newMonthTitle)}</AppText>
        </View>

        <AppCard style={styles.summaryCard}>
          <AppText variant="tiny" style={styles.summaryLabel}>
            {previousLabel}
          </AppText>
          <AppText
            weight={700}
            color={overLimit ? 'coral' : 'nile'}
            style={styles.summaryAmount}
          >
            {formatMoney(previousSpend)}
          </AppText>
          <AppText variant="tiny">
            {overLimit
              ? t(localizationKeys.overLimitLast)
              : t(localizationKeys.underLimitLast)}
          </AppText>
        </AppCard>

        <AppText variant="h3" style={styles.sectionTitle}>
          {t(localizationKeys.confirmRecurringTitle)}
        </AppText>

        {pending.length === 0 ? (
          <View style={styles.emptyPending}>
            <AppText variant="tiny">
              {t(localizationKeys.noRecurringPending)}
            </AppText>
          </View>
        ) : (
          <AppCard style={styles.pendingCard}>
            {pending.map((transaction, index) => {
              const category = categoriesById.get(transaction.categoryId);
              const label = category
                ? language === 'ar'
                  ? category.labelAr
                  : category.labelEn
                : t(localizationKeys.unknown);
              const color = category?.color ?? theme.colors.ink3;
              const isLast = index === pending.length - 1;

              return (
                <View
                  key={pendingRecurringKey(transaction)}
                  style={[styles.pendingRow, isLast && styles.pendingRowLast]}
                >
                  <View style={[styles.catDot, { backgroundColor: color }]}>
                    <AppIcon
                      name={
                        transaction.type === 'income' ? 'chevUp' : 'chevDown'
                      }
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>
                  <View style={styles.pendingMid}>
                    <AppText weight={600} numberOfLines={1}>
                      {label}
                    </AppText>
                    <AppText variant="tiny">
                      {t(localizationKeys.lastAmountValue, {
                        label: t(localizationKeys.lastAmount),
                        amount: formatMoney(transaction.amount),
                      })}
                    </AppText>
                  </View>
                  <View style={styles.pendingActions}>
                    <Pressable
                      style={styles.iconBtn}
                      onPress={() => handleEdit(transaction)}
                      accessibilityRole="button"
                      accessibilityLabel={t(localizationKeys.editRecurring)}
                    >
                      <AppIcon name="edit" size={14} color={theme.colors.ink} />
                    </Pressable>
                    <Pressable
                      style={styles.iconBtn}
                      onPress={() => {
                        handleConfirm(transaction);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={t(localizationKeys.confirmRecurring)}
                      disabled={addMutation.isPending}
                    >
                      <AppIcon
                        name="check"
                        size={15}
                        color={theme.colors.nile}
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </AppCard>
        )}

        <AppButton
          variant="primary"
          style={styles.continueButton}
          onPress={onDismiss}
        >
          {t(localizationKeys.continueToHome)}
        </AppButton>
      </ScrollView>
    </View>
  );
};

export default NewMonthScreen;

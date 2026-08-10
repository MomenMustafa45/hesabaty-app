import React, { useMemo } from 'react';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';
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
import { formatMonthLabel, toIsoDate, toYearMonthKey } from '@lib/dateUtils';
import { Transaction } from '@models/transaction';
import { useTheme } from '@providers/ThemeProvider';
import { useRolloverStore } from '@store/rolloverStore';
import { useSettingsStore } from '@store/settingsStore';
import { useTransactionSheetStore } from '@store/transactionSheetStore';
import { createStyles } from './NewMonthScreen.styles';

export interface NewMonthScreenProps {
  onDismiss: () => void;
}

export const NewMonthScreen: React.FC<NewMonthScreenProps> = ({ onDismiss }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
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
    language === 'ar' ? 'ar-EG' : 'en-US',
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
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Back">
            <AppIcon
              name={I18nManager.isRTL ? 'chevronRight' : 'chevronLeft'}
              size={16}
              color={theme.colors.ink}
            />
          </Pressable>
          <AppText variant="h2">New month</AppText>
        </View>

        <AppCard style={styles.summaryCard}>
          <AppText variant="tiny" style={styles.summaryLabel}>
            {previousLabel}
          </AppText>
          <AppText
            weight={700}
            color={overLimit ? 'coral' : 'nile'}
            style={styles.summaryAmount}>
            {formatMoney(previousSpend)}
          </AppText>
          <AppText variant="tiny">
            {overLimit ? 'over your limit' : 'within your limit'}
          </AppText>
        </AppCard>

        <AppText variant="h3" style={styles.sectionTitle}>
          Confirm your recurring bills
        </AppText>

        {pending.length === 0 ? (
          <View style={styles.emptyPending}>
            <AppText variant="tiny">
              No recurring bills waiting for confirmation.
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
                : 'Unknown';
              const color = category?.color ?? theme.colors.ink3;
              const isLast = index === pending.length - 1;

              return (
                <View
                  key={pendingRecurringKey(transaction)}
                  style={[styles.pendingRow, isLast && styles.pendingRowLast]}>
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
                      Last amount: {formatMoney(transaction.amount)}
                    </AppText>
                  </View>
                  <View style={styles.pendingActions}>
                    <Pressable
                      style={styles.iconBtn}
                      onPress={() => handleEdit(transaction)}
                      accessibilityRole="button"
                      accessibilityLabel="Edit recurring">
                      <AppIcon name="edit" size={14} color={theme.colors.ink} />
                    </Pressable>
                    <Pressable
                      style={styles.iconBtn}
                      onPress={() => {
                        void handleConfirm(transaction);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Confirm recurring"
                      disabled={addMutation.isPending}>
                      <AppIcon name="check" size={15} color={theme.colors.nile} />
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
          onPress={onDismiss}>
          Continue to home
        </AppButton>
      </ScrollView>
    </View>
  );
};

export default NewMonthScreen;

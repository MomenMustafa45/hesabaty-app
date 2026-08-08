/**
 * TODO(M3 verify): temporary throwaway screen to verify SQLite schema + seed
 * data + React Query layer. Swapped in at the Home tab in AppNavigator —
 * restore HomeScreen and delete this file (+ DebugDataScreen.styles.ts) once
 * verified. Same pattern as M1's GalleryScreen.
 */
import React, { useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppText from '@components/AppText';
import { useCategories } from '@features/categories/hooks/useCategories';
import { useAddTransaction } from '@features/transactions/hooks/useAddTransaction';
import { useTransactions } from '@features/transactions/hooks/useTransactions';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './DebugDataScreen.styles';

const buildTestTransactionInput = () => {
  const today = new Date().toISOString().slice(0, 10);
  return {
    type: 'expense' as const,
    categoryId: 'food',
    amount: 5000,
    description: 'M3 debug test (50.00 EGP)',
    date: today,
    recurring: false,
  };
};

export const DebugDataScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const categoriesQuery = useCategories();
  const transactionsQuery = useTransactions();
  const addTransaction = useAddTransaction();
  const didAutoInsertRef = useRef(false);

  // One-shot auto-insert so verification screenshots can show a mutation
  // result without relying on host UI automation. Still temporary — delete
  // with this whole screen.
  useEffect(() => {
    if (didAutoInsertRef.current) {
      return;
    }
    if (!transactionsQuery.isSuccess) {
      return;
    }
    if ((transactionsQuery.data?.length ?? 0) > 0) {
      return;
    }
    didAutoInsertRef.current = true;
    addTransaction.mutate(buildTestTransactionInput());
  }, [
    addTransaction,
    transactionsQuery.data?.length,
    transactionsQuery.isSuccess,
  ]);

  const handleInsertTestTransaction = () => {
    addTransaction.mutate(buildTestTransactionInput());
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="h1">Debug Data (M3)</AppText>
        <AppText variant="muted">
          Temporary — delete after schema/seed verification.
        </AppText>

        <AppButton
          variant="primary"
          onPress={handleInsertTestTransaction}
          disabled={addTransaction.isPending}>
          Insert test transaction
        </AppButton>

        <View style={styles.section}>
          <AppText variant="h2">
            Transactions ({transactionsQuery.data?.length ?? 0})
          </AppText>
          {transactionsQuery.isLoading ? (
            <AppText variant="muted">Loading…</AppText>
          ) : null}
          {transactionsQuery.isError ? (
            <AppText variant="body" color="coral">
              {String(transactionsQuery.error)}
            </AppText>
          ) : null}
          {(transactionsQuery.data?.length ?? 0) === 0 &&
          !transactionsQuery.isLoading ? (
            <AppText variant="muted" style={styles.empty}>
              No transactions yet — use the button above.
            </AppText>
          ) : null}
          {transactionsQuery.data?.map((transaction) => (
            <View key={transaction.id} style={styles.row}>
              <AppText variant="h3">{transaction.id}</AppText>
              <AppText variant="tiny">
                {transaction.type} · cat={transaction.categoryId} · amount=
                {transaction.amount} · date={transaction.date} · recurring=
                {transaction.recurring ? 1 : 0}
              </AppText>
              <AppText variant="tiny">
                {transaction.description ?? '(no description)'}
              </AppText>
              <AppText variant="tiny">
                created={transaction.createdAt} · updated=
                {transaction.updatedAt}
              </AppText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <AppText variant="h2">
            Categories ({categoriesQuery.data?.length ?? 0})
          </AppText>
          {categoriesQuery.isLoading ? (
            <AppText variant="muted">Loading…</AppText>
          ) : null}
          {categoriesQuery.isError ? (
            <AppText variant="body" color="coral">
              {String(categoriesQuery.error)}
            </AppText>
          ) : null}
          {categoriesQuery.data?.map((category) => (
            <View key={category.id} style={styles.row}>
              <View style={styles.rowHeader}>
                <View
                  style={[styles.colorDot, { backgroundColor: category.color }]}
                />
                <AppText variant="h3">{category.id}</AppText>
              </View>
              <AppText variant="tiny">
                {category.type} · {category.labelEn} / {category.labelAr} ·{' '}
                {category.color} · default={category.isDefault ? 1 : 0} · sort=
                {category.sortOrder}
              </AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DebugDataScreen;

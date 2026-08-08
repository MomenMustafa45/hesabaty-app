import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import { useCategories } from '@features/categories/hooks/useCategories';
import { useCurrency } from '@hooks/useCurrency';
import { Category } from '@models/category';
import { Transaction } from '@models/transaction';
import { useSettingsStore } from '@store/settingsStore';
import { useTransactionSheetStore } from '@store/transactionSheetStore';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './RecentTransactionsList.styles';

export interface RecentTransactionsListProps {
  transactions: Transaction[];
}

function categoryLabel(category: Category | undefined, language: string): string {
  if (!category) {
    return 'Unknown';
  }
  return language === 'ar' ? category.labelAr : category.labelEn;
}

function formatRowDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
  transactions,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { formatMoney } = useCurrency();
  const language = useSettingsStore(state => state.language);
  const openEdit = useTransactionSheetStore(state => state.openEdit);
  const { data: categories = [] } = useCategories();

  const categoriesById = useMemo(() => {
    const map = new Map<string, Category>();
    for (const category of categories) {
      map.set(category.id, category);
    }
    return map;
  }, [categories]);

  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5),
    [transactions],
  );

  return (
    <View style={styles.card}>
      {recent.map((transaction, index) => {
        const category = categoriesById.get(transaction.categoryId);
        const label = categoryLabel(category, language);
        const sign = transaction.type === 'expense' ? '−' : '+';
        const directionIcon =
          transaction.type === 'income' ? 'chevUp' : 'chevDown';
        const dateStr = formatRowDate(transaction.date);
        const subline = transaction.description
          ? `${transaction.description} · ${dateStr}`
          : dateStr;
        const isLast = index === recent.length - 1;

        return (
          <Pressable
            key={transaction.id}
            style={[styles.row, isLast && styles.rowLast]}
            onPress={() => openEdit(transaction)}>
            <View
              style={[
                styles.catDot,
                { backgroundColor: category?.color ?? theme.colors.ink3 },
              ]}>
              <AppIcon
                name={directionIcon}
                size={16}
                color={theme.ringColors.ringSafe}
              />
            </View>
            <View style={styles.mid}>
              <AppText weight={600} numberOfLines={1}>
                {label}
                {transaction.recurring ? ' ↻' : ''}
              </AppText>
              <AppText variant="tiny" numberOfLines={1}>
                {subline}
              </AppText>
            </View>
            <AppText
              weight={700}
              color={transaction.type === 'expense' ? 'coral' : 'nile'}>
              {sign}
              {formatMoney(transaction.amount)}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

export default RecentTransactionsList;

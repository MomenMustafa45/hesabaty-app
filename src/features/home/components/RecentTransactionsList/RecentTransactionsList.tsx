import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useCategories } from '@features/categories/hooks/useCategories';
import { TransactionRow } from '@features/transactions/components/TransactionRow';
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
        const dateStr = formatRowDate(transaction.date);
        const subline = transaction.description
          ? `${transaction.description} · ${dateStr}`
          : dateStr;

        return (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            categoryLabel={categoryLabel(category, language)}
            categoryColor={category?.color ?? theme.colors.ink3}
            subline={subline}
            isLast={index === recent.length - 1}
            onPress={() => openEdit(transaction)}
          />
        );
      })}
    </View>
  );
};

export default RecentTransactionsList;

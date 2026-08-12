import { useMemo } from 'react';
import { localeForLanguage, monthDateRange, parseIsoDate } from '@lib/dateUtils';
import { Transaction } from '@models/transaction';
import { useTransactions } from '@features/transactions/hooks/useTransactions';
import { useSettingsStore } from '@store/settingsStore';

export interface TransactionDateGroup {
  date: string;
  label: string;
  transactions: Transaction[];
}

function formatGroupLabel(isoDate: string, locale: string): string {
  return parseIsoDate(isoDate).toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Calendar-month transactions grouped by date (newest groups first). */
export function useMonthTransactions(monthKey: string): {
  groups: TransactionDateGroup[];
  transactions: Transaction[];
  isLoading: boolean;
} {
  const language = useSettingsStore(state => state.language);
  const locale = localeForLanguage(language);
  const { dateFrom, dateTo } = monthDateRange(monthKey);
  const { data: transactions = [], isLoading } = useTransactions({
    dateFrom,
    dateTo,
  });

  const groups = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
    const byDate = new Map<string, Transaction[]>();
    for (const transaction of sorted) {
      const existing = byDate.get(transaction.date);
      if (existing) {
        existing.push(transaction);
      } else {
        byDate.set(transaction.date, [transaction]);
      }
    }

    return Array.from(byDate.entries()).map(([date, dayTransactions]) => ({
      date,
      label: formatGroupLabel(date, locale),
      transactions: dayTransactions,
    }));
  }, [transactions, locale]);

  return { groups, transactions, isLoading };
}

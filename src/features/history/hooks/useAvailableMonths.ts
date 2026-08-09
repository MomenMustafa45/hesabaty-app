import { useMemo } from 'react';
import { toYearMonthKey } from '@lib/dateUtils';
import { useTransactions } from '@features/transactions/hooks/useTransactions';

/** Sorted `YYYY-MM` keys with ≥1 txn, always including the current month. */
export function useAvailableMonths(): {
  months: string[];
  isLoading: boolean;
} {
  const { data: transactions = [], isLoading } = useTransactions();

  const months = useMemo(() => {
    const keys = new Set(transactions.map(transaction => transaction.date.slice(0, 7)));
    keys.add(toYearMonthKey(new Date()));
    return Array.from(keys).sort();
  }, [transactions]);

  return { months, isLoading };
}

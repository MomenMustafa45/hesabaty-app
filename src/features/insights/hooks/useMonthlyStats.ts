import { useMemo } from 'react';
import { toYearMonthKey } from '@lib/dateUtils';
import { useAvailableMonths } from '@features/history/hooks/useAvailableMonths';
import { useTransactions } from '@features/transactions/hooks/useTransactions';

export interface MonthStat {
  key: string;
  totalSpend: number;
  totalIncome: number;
  net: number;
}

/** Calendar-month spend/income/net for every available month, ascending. */
export function useMonthlyStats(): {
  stats: MonthStat[];
  currentMonthKey: string;
  isLoading: boolean;
} {
  const { months, isLoading: monthsLoading } = useAvailableMonths();
  const { data: transactions = [], isLoading: transactionsLoading } =
    useTransactions();

  const stats = useMemo(() => {
    const totalsByMonth = new Map<
      string,
      { totalSpend: number; totalIncome: number }
    >();
    for (const transaction of transactions) {
      const key = transaction.date.slice(0, 7);
      const existing = totalsByMonth.get(key) ?? {
        totalSpend: 0,
        totalIncome: 0,
      };
      if (transaction.type === 'expense') {
        existing.totalSpend += transaction.amount;
      } else {
        existing.totalIncome += transaction.amount;
      }
      totalsByMonth.set(key, existing);
    }

    return months.map((key): MonthStat => {
      const totals = totalsByMonth.get(key) ?? {
        totalSpend: 0,
        totalIncome: 0,
      };
      return {
        key,
        totalSpend: totals.totalSpend,
        totalIncome: totals.totalIncome,
        net: totals.totalIncome - totals.totalSpend,
      };
    });
  }, [months, transactions]);

  return {
    stats,
    currentMonthKey: toYearMonthKey(new Date()),
    isLoading: monthsLoading || transactionsLoading,
  };
}

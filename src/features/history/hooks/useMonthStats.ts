import { useMemo } from 'react';
import { monthDateRange } from '@lib/dateUtils';
import { useTransactions } from '@features/transactions/hooks/useTransactions';

export interface MonthStats {
  totalSpend: number;
  totalIncome: number;
  net: number;
  isLoading: boolean;
}

/** Calendar-month spend/income (not cycle-bounded — see architecture §11.1). */
export function useMonthStats(monthKey: string): MonthStats {
  const { dateFrom, dateTo } = monthDateRange(monthKey);
  const { data: transactions = [], isLoading } = useTransactions({
    dateFrom,
    dateTo,
  });

  return useMemo(() => {
    let totalSpend = 0;
    let totalIncome = 0;
    for (const transaction of transactions) {
      if (transaction.type === 'expense') {
        totalSpend += transaction.amount;
      } else {
        totalIncome += transaction.amount;
      }
    }

    return {
      totalSpend,
      totalIncome,
      net: totalIncome - totalSpend,
      isLoading,
    };
  }, [transactions, isLoading]);
}

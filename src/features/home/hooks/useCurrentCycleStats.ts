import { useMemo } from 'react';
import { toIsoDate } from '@lib/dateUtils';
import { useCycleRange } from '@hooks/useCycleRange';
import { useSettingsStore } from '@store/settingsStore';
import { useTransactions } from '@features/transactions/hooks/useTransactions';

export interface CurrentCycleStats {
  totalSpend: number;
  totalIncome: number;
  net: number;
  limitPct: number;
  cyclePct: number;
  isLoading: boolean;
}

const MS_PER_DAY = 86_400_000;

export function useCurrentCycleStats(): CurrentCycleStats {
  const { start, end } = useCycleRange();
  const monthlyLimit = useSettingsStore(state => state.monthlyLimit);
  const dateFrom = toIsoDate(start);
  const dateTo = toIsoDate(end);

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

    const limitPct =
      monthlyLimit != null && monthlyLimit > 0
        ? Math.min(1, totalSpend / monthlyLimit)
        : 0;

    const now = Date.now();
    const cyclePct = Math.min(
      1,
      (now - start.getTime()) / (end.getTime() - start.getTime() + MS_PER_DAY),
    );

    return {
      totalSpend,
      totalIncome,
      net: totalIncome - totalSpend,
      limitPct,
      cyclePct,
      isLoading,
    };
  }, [transactions, monthlyLimit, start, end, isLoading]);
}

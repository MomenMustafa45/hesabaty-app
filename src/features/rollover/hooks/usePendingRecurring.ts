import { useMemo } from 'react';
import {
  getPreviousCycleRange,
  useCycleRange,
} from '@hooks/useCycleRange';
import { toIsoDate } from '@lib/dateUtils';
import { Transaction } from '@models/transaction';
import { useSettingsStore } from '@store/settingsStore';
import { useRolloverStore } from '@store/rolloverStore';
import { useTransactions } from '@features/transactions/hooks/useTransactions';

export function pendingRecurringKey(transaction: {
  type: string;
  categoryId: string;
}): string {
  return `${transaction.type}:${transaction.categoryId}`;
}

/**
 * Recurring txns from the previous cycle not yet re-logged in the current
 * one — ports the prototype's `pendingRecurring()`, using cycle ranges
 * (not calendar months) so custom start-day cycles stay consistent.
 */
export function usePendingRecurring(): {
  pending: Transaction[];
  previousCycle: { start: Date; end: Date };
  isLoading: boolean;
} {
  const current = useCycleRange();
  const cycleType = useSettingsStore(state => state.cycleType);
  const cycleStartDay = useSettingsStore(state => state.cycleStartDay);
  const dismissedKeys = useRolloverStore(state => state.dismissedKeys);

  const previousCycle = useMemo(
    () => getPreviousCycleRange(current.start, cycleType, cycleStartDay),
    [current.start, cycleType, cycleStartDay],
  );

  const prevFrom = toIsoDate(previousCycle.start);
  const prevTo = toIsoDate(previousCycle.end);
  const curFrom = toIsoDate(current.start);
  const curTo = toIsoDate(current.end);

  const { data: previousTxns = [], isLoading: prevLoading } = useTransactions({
    dateFrom: prevFrom,
    dateTo: prevTo,
  });
  const { data: currentTxns = [], isLoading: curLoading } = useTransactions({
    dateFrom: curFrom,
    dateTo: curTo,
  });

  const pending = useMemo(() => {
    const byKey = new Map<string, Transaction>();
    for (const transaction of previousTxns) {
      if (!transaction.recurring) {
        continue;
      }
      byKey.set(pendingRecurringKey(transaction), transaction);
    }

    const currentKeys = new Set(currentTxns.map(pendingRecurringKey));

    return Array.from(byKey.values()).filter(transaction => {
      const key = pendingRecurringKey(transaction);
      return !dismissedKeys.includes(key) && !currentKeys.has(key);
    });
  }, [previousTxns, currentTxns, dismissedKeys]);

  return {
    pending,
    previousCycle,
    isLoading: prevLoading || curLoading,
  };
}

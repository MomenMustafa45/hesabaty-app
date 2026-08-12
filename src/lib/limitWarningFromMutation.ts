import { getCycleRange } from '@hooks/useCycleRange';
import { toIsoDate } from '@lib/dateUtils';
import { checkLimitWarning, scheduleDailyReminder } from '@lib/notifications';
import { getTransactions } from '@features/transactions/api/transactionsApi';
import { Transaction, TransactionType } from '@models/transaction';
import { useSettingsStore } from '@store/settingsStore';

type ExpenseLike = {
  type: TransactionType;
  amount: number;
  date: string;
};

function expenseContributionInCycle(
  tx: ExpenseLike,
  dateFrom: string,
  dateTo: string,
): number {
  if (tx.type !== 'expense') {
    return 0;
  }
  if (tx.date < dateFrom || tx.date > dateTo) {
    return 0;
  }
  return tx.amount;
}

async function currentCycleExpenseContext(): Promise<{
  cycleKey: string;
  dateFrom: string;
  dateTo: string;
  spendMinor: number;
  monthlyLimitMinor: number | null;
}> {
  const { cycleType, cycleStartDay, monthlyLimit } = useSettingsStore.getState();
  const { start, end } = getCycleRange(new Date(), cycleType, cycleStartDay);
  const cycleKey = toIsoDate(start);
  const dateFrom = toIsoDate(start);
  const dateTo = toIsoDate(end);
  const rows = await getTransactions({
    type: 'expense',
    dateFrom,
    dateTo,
  });
  const spendMinor = rows.reduce(
    (sum: number, row: Transaction) => sum + row.amount,
    0,
  );
  return {
    cycleKey,
    dateFrom,
    dateTo,
    spendMinor,
    monthlyLimitMinor: monthlyLimit,
  };
}

/** Re-arm daily reminder after any transaction mutation (today's log status may change). */
export async function reevaluateDailyReminderAfterMutation(): Promise<void> {
  await scheduleDailyReminder();
}

export async function runLimitWarningAfterAdd(
  input: ExpenseLike,
): Promise<void> {
  const ctx = await currentCycleExpenseContext();
  const contrib = expenseContributionInCycle(
    input,
    ctx.dateFrom,
    ctx.dateTo,
  );
  await checkLimitWarning({
    cycleKey: ctx.cycleKey,
    previousSpendMinor: Math.max(0, ctx.spendMinor - contrib),
    newSpendMinor: ctx.spendMinor,
    monthlyLimitMinor: ctx.monthlyLimitMinor,
  });
}

export async function runLimitWarningAfterUpdate(
  previous: ExpenseLike,
  next: ExpenseLike,
): Promise<void> {
  const ctx = await currentCycleExpenseContext();
  const prevContrib = expenseContributionInCycle(
    previous,
    ctx.dateFrom,
    ctx.dateTo,
  );
  const nextContrib = expenseContributionInCycle(
    next,
    ctx.dateFrom,
    ctx.dateTo,
  );
  const previousSpend = Math.max(
    0,
    ctx.spendMinor - nextContrib + prevContrib,
  );
  await checkLimitWarning({
    cycleKey: ctx.cycleKey,
    previousSpendMinor: previousSpend,
    newSpendMinor: ctx.spendMinor,
    monthlyLimitMinor: ctx.monthlyLimitMinor,
  });
}

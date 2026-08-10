import { BestMonthMetric, useBestMonthMetricStore } from '@store/bestMonthMetricStore';
import { MonthStat, useMonthlyStats } from './useMonthlyStats';

function isBetter(candidate: MonthStat, current: MonthStat, metric: BestMonthMetric): boolean {
  if (metric === 'spend') {
    return candidate.totalSpend < current.totalSpend;
  }
  return candidate.net > current.net;
}

/** Winning month among completed months only, by the shared metric — ports `computeBestKey()`. */
export function useBestMonth(): {
  bestKey: string | null;
  bestStat: MonthStat | null;
  metric: BestMonthMetric;
  setMetric: (metric: BestMonthMetric) => void;
  isLoading: boolean;
} {
  const { stats, currentMonthKey, isLoading } = useMonthlyStats();
  const metric = useBestMonthMetricStore(state => state.metric);
  const setMetric = useBestMonthMetricStore(state => state.setMetric);

  const completed = stats.filter(stat => stat.key !== currentMonthKey);
  const bestStat =
    completed.length === 0
      ? null
      : completed.reduce((best, candidate) =>
          isBetter(candidate, best, metric) ? candidate : best,
        );

  return {
    bestKey: bestStat?.key ?? null,
    bestStat,
    metric,
    setMetric,
    isLoading,
  };
}

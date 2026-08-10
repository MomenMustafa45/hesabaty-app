import { create } from 'zustand';

export type BestMonthMetric = 'spend' | 'savings';

interface BestMonthMetricState {
  metric: BestMonthMetric;
  setMetric: (metric: BestMonthMetric) => void;
}

/** In-memory only — shared by History's picker badge and Insights' toggle. */
export const useBestMonthMetricStore = create<BestMonthMetricState>(set => ({
  metric: 'spend',
  setMetric: metric => set({ metric }),
}));

import { useMemo } from 'react';
import { useSettingsStore } from '@store/settingsStore';

export interface CycleRange {
  start: Date;
  end: Date;
}

/**
 * Current budget cycle relative to now — ported from the prototype's
 * `getCycleRange()` (hasabaty-prototype-v7.html).
 */
export function getCycleRange(
  ref: Date,
  cycleType: 'calendar' | 'custom' | null,
  cycleStartDay: number | null,
): CycleRange {
  if (cycleType !== 'custom') {
    return {
      start: new Date(ref.getFullYear(), ref.getMonth(), 1),
      end: new Date(ref.getFullYear(), ref.getMonth() + 1, 0),
    };
  }

  const day = cycleStartDay || 1;
  let start = new Date(ref.getFullYear(), ref.getMonth(), Math.min(day, 28));
  if (ref.getDate() < day) {
    start = new Date(ref.getFullYear(), ref.getMonth() - 1, Math.min(day, 28));
  }
  const end = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    Math.min(day, 28),
  );
  end.setDate(end.getDate() - 1);
  return { start, end };
}

export function useCycleRange(): CycleRange {
  const cycleType = useSettingsStore(state => state.cycleType);
  const cycleStartDay = useSettingsStore(state => state.cycleStartDay);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  return useMemo(
    () => getCycleRange(new Date(year, month, date), cycleType, cycleStartDay),
    [cycleType, cycleStartDay, year, month, date],
  );
}

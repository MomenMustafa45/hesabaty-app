import { useEffect } from 'react';
import { useCycleRange } from '@hooks/useCycleRange';
import { toIsoDate } from '@lib/dateUtils';
import { fireMonthlyReport } from '@lib/notifications';
import { useRolloverStore } from '@store/rolloverStore';
import { useSettingsStore } from '@store/settingsStore';

/**
 * App-shell rollover gate. Initializes `lastSeenCycleKey` silently on first
 * post-onboarding launch (so the UI is skipped), then surfaces the screen
 * when the live cycle key differs from the last-seen one — or when Settings'
 * Prototype preview forces it open.
 */
export function useCycleRolloverCheck(): {
  isVisible: boolean;
  currentCycleKey: string;
  isNaturalPending: boolean;
  dismiss: () => void;
} {
  const { start } = useCycleRange();
  const currentCycleKey = toIsoDate(start);
  const lastSeenCycleKey = useSettingsStore(state => state.lastSeenCycleKey);
  const setLastSeenCycleKey = useSettingsStore(
    state => state.setLastSeenCycleKey,
  );
  const manualPreview = useRolloverStore(state => state.manualPreview);
  const resetSession = useRolloverStore(state => state.resetSession);

  useEffect(() => {
    if (lastSeenCycleKey === null) {
      setLastSeenCycleKey(currentCycleKey);
    }
  }, [lastSeenCycleKey, currentCycleKey, setLastSeenCycleKey]);

  const isNaturalPending =
    lastSeenCycleKey != null && lastSeenCycleKey !== currentCycleKey;
  const isVisible = isNaturalPending || manualPreview;

  useEffect(() => {
    if (!isNaturalPending) {
      return;
    }
    fireMonthlyReport(currentCycleKey);
  }, [isNaturalPending, currentCycleKey]);

  const dismiss = () => {
    if (isNaturalPending) {
      setLastSeenCycleKey(currentCycleKey);
    }
    resetSession();
  };

  return {
    isVisible,
    currentCycleKey,
    isNaturalPending,
    dismiss,
  };
}

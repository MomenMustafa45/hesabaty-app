import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { cancelDailyReminder, scheduleDailyReminder } from '@lib/notifications';
import { useSettingsStore } from '@store/settingsStore';

/**
 * App-shell host for 14.1 daily-reminder re-evaluation.
 * Re-arms on foreground/background and when daily reminder prefs change.
 */
export const NotificationsLifecycle: React.FC = () => {
  const dailyReminderEnabled = useSettingsStore(
    state => state.dailyReminderEnabled,
  );
  const dailyReminderTime = useSettingsStore(state => state.dailyReminderTime);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!dailyReminderEnabled) {
      cancelDailyReminder();
      return;
    }
    scheduleDailyReminder();
  }, [dailyReminderEnabled, dailyReminderTime]);

  useEffect(() => {
    const handleChange = (next: AppStateStatus) => {
      const prev = appState.current;
      appState.current = next;
      if ((prev === 'background' || prev === 'inactive') && next === 'active') {
        scheduleDailyReminder();
        return;
      }
      if (next === 'background' || next === 'inactive') {
        scheduleDailyReminder();
      }
    };

    const subscription = AppState.addEventListener('change', handleChange);
    return () => {
      subscription.remove();
    };
  }, []);

  return null;
};

export default NotificationsLifecycle;

import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from 'react-native-notify-kit';
import { Platform } from 'react-native';
import { getTransactions } from '@features/transactions/api/transactionsApi';
import { toIsoDate } from '@lib/dateUtils';
import { mmkv } from '@storage/mmkv';
import { storageKeys } from '@storage/keys';
import { useSettingsStore } from '@store/settingsStore';

export const NOTIFICATION_IDS = {
  dailyReminder: 'hasabaty-daily-reminder',
  limitWarning: 'hasabaty-limit-warning',
  monthlyReport: 'hasabaty-monthly-report',
  devTest: 'hasabaty-dev-test',
} as const;

const ANDROID_CHANNEL_ID = 'hasabaty-default';

type LimitTier = 0 | 80 | 100;

interface LimitWarningState {
  cycleKey: string;
  tier: LimitTier;
}

function readLimitWarningState(): LimitWarningState | null {
  const raw = mmkv.getString(storageKeys.limitWarningState);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as LimitWarningState;
  } catch {
    return null;
  }
}

function writeLimitWarningState(state: LimitWarningState): void {
  mmkv.set(storageKeys.limitWarningState, JSON.stringify(state));
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await notifee.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: 'Hasabaty',
    importance: AndroidImportance.HIGH,
  });
}

export async function hasNotificationPermission(): Promise<boolean> {
  const settings = await notifee.getNotificationSettings();
  const status = settings.authorizationStatus;
  return (
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL
  );
}

function androidPayload() {
  return Platform.OS === 'android'
    ? { android: { channelId: ANDROID_CHANNEL_ID } }
    : {};
}

function nextDailyFireDate(timeHHMM: string, now: Date = new Date()): Date {
  const [hours, minutes] = timeHHMM.split(':').map(Number);
  const candidate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours || 0,
    minutes || 0,
    0,
    0,
  );
  if (candidate.getTime() <= now.getTime()) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}

async function hasLoggedExpenseOrIncomeToday(): Promise<boolean> {
  const today = toIsoDate(new Date());
  const rows = await getTransactions({ dateFrom: today, dateTo: today });
  return rows.length > 0;
}

/** Cancel any armed daily-reminder trigger. */
export async function cancelDailyReminder(): Promise<void> {
  await notifee.cancelTriggerNotification(NOTIFICATION_IDS.dailyReminder);
}

/**
 * 14.1 — Re-evaluate and (re)arm a one-shot TIMESTAMP for the next eligible
 * daily reminder. Not a static RepeatFrequency.DAILY schedule.
 */
export async function scheduleDailyReminder(): Promise<void> {
  const { dailyReminderEnabled, dailyReminderTime } = useSettingsStore.getState();

  if (!dailyReminderEnabled) {
    await cancelDailyReminder();
    return;
  }

  if (!(await hasNotificationPermission())) {
    await cancelDailyReminder();
    return;
  }

  await ensureAndroidChannel();

  const loggedToday = await hasLoggedExpenseOrIncomeToday();
  const now = new Date();
  let fireAt: Date;

  if (loggedToday) {
    // Skip today's slot; arm tomorrow at configured time.
    const [hours, minutes] = dailyReminderTime.split(':').map(Number);
    fireAt = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      hours || 0,
      minutes || 0,
      0,
      0,
    );
  } else {
    fireAt = nextDailyFireDate(dailyReminderTime, now);
  }

  await cancelDailyReminder();

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: fireAt.getTime(),
  };

  await notifee.createTriggerNotification(
    {
      id: NOTIFICATION_IDS.dailyReminder,
      title: 'Hasabaty',
      body: "Don't forget to log today's spending.",
      ...androidPayload(),
    },
    trigger,
  );
}

/**
 * 14.2 — Immediate local notification when spend newly crosses 80% or 100%.
 * Not scheduled; call from mutation success handlers.
 */
export async function checkLimitWarning(input: {
  cycleKey: string;
  previousSpendMinor: number;
  newSpendMinor: number;
  monthlyLimitMinor: number | null;
}): Promise<void> {
  const { limitWarningsEnabled } = useSettingsStore.getState();
  if (!limitWarningsEnabled) {
    return;
  }
  if (
    input.monthlyLimitMinor == null ||
    input.monthlyLimitMinor <= 0
  ) {
    return;
  }
  if (!(await hasNotificationPermission())) {
    return;
  }

  const limit = input.monthlyLimitMinor;
  const prevPct = input.previousSpendMinor / limit;
  const newPct = input.newSpendMinor / limit;

  let crossed: LimitTier | null = null;
  if (prevPct < 1 && newPct >= 1) {
    crossed = 100;
  } else if (prevPct < 0.8 && newPct >= 0.8) {
    crossed = 80;
  }

  if (crossed == null) {
    return;
  }

  const saved = readLimitWarningState();
  if (
    saved?.cycleKey === input.cycleKey &&
    saved.tier >= crossed
  ) {
    return;
  }

  await ensureAndroidChannel();

  const body =
    crossed === 100
      ? "You've reached your budget limit."
      : "You've used 80% of your budget.";

  await notifee.displayNotification({
    id: NOTIFICATION_IDS.limitWarning,
    title: 'Hasabaty',
    body,
    ...androidPayload(),
  });

  writeLimitWarningState({ cycleKey: input.cycleKey, tier: crossed });
}

/**
 * 14.3 — Fire once when natural cycle rollover is detected.
 */
export async function fireMonthlyReport(cycleKey: string): Promise<void> {
  const { monthlyReportEnabled } = useSettingsStore.getState();
  if (!monthlyReportEnabled) {
    return;
  }
  if (!(await hasNotificationPermission())) {
    return;
  }

  const last = mmkv.getString(storageKeys.monthlyReportNotifiedCycleKey);
  if (last === cycleKey) {
    return;
  }

  await ensureAndroidChannel();
  await notifee.displayNotification({
    id: NOTIFICATION_IDS.monthlyReport,
    title: 'Hasabaty',
    body: 'Your new cycle report is ready.',
    ...androidPayload(),
  });

  mmkv.set(storageKeys.monthlyReportNotifiedCycleKey, cycleKey);
}

/**
 * 14.4 — Dev-only fast path: arm a test notification a short delay out.
 * Returns the scheduled fire Date for verification messaging.
 */
export async function scheduleDevTestNotification(
  delayMs: number = 90_000,
): Promise<Date> {
  if (!(await hasNotificationPermission())) {
    throw new Error('Notification permission not granted');
  }

  await ensureAndroidChannel();
  await notifee.cancelTriggerNotification(NOTIFICATION_IDS.devTest);

  const fireAt = new Date(Date.now() + delayMs);
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: fireAt.getTime(),
  };

  await notifee.createTriggerNotification(
    {
      id: NOTIFICATION_IDS.devTest,
      title: 'Hasabaty',
      body: 'Dev test notification — scheduling works.',
      ...androidPayload(),
    },
    trigger,
  );

  return fireAt;
}

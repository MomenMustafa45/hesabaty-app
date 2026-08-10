export type CycleType = 'calendar' | 'custom';

export type AppLanguage = 'en' | 'ar';

/** null = follow system Appearance; explicit value = user override (§1, §13.3). */
export type ThemeOverride = 'light' | 'dark' | null;

export type OnboardingStep =
  | 'Welcome'
  | 'CurrencyStep'
  | 'CycleAndLimitStep'
  | 'NotificationPermissionStep';

export interface OnboardingDraft {
  step: OnboardingStep;
  currency: string;
  cycleType: CycleType;
  cycleStartDay: number | null;
  /** Major-unit string as shown in the limit input. */
  draftLimitMajor: string;
}

export interface SettingsState {
  currency: string | null;
  /** Integer minor-units (piastres). */
  monthlyLimit: number | null;
  cycleType: CycleType | null;
  /** 1–28; only meaningful when cycleType === 'custom'. */
  cycleStartDay: number | null;
  onboarded: boolean;
  language: AppLanguage;
  onboardingDraft: OnboardingDraft | null;
  themeOverride: ThemeOverride;
  dailyReminderEnabled: boolean;
  /** "HH:MM", 24-hour — matches the prototype's <input type="time"> format. */
  dailyReminderTime: string;
  limitWarningsEnabled: boolean;
  monthlyReportEnabled: boolean;
  /** Drives rollover detection (§13.8) — null until the first cycle is seen. */
  lastSeenCycleKey: string | null;
}

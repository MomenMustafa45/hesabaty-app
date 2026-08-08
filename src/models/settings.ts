export type CycleType = 'calendar' | 'custom';

export type AppLanguage = 'en' | 'ar';

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
}

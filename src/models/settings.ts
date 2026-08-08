export type CycleType = 'calendar' | 'custom';

export interface SettingsState {
  currency: string | null;
  /** Integer minor-units (piastres). */
  monthlyLimit: number | null;
  cycleType: CycleType | null;
  /** 1–28; only meaningful when cycleType === 'custom'. */
  cycleStartDay: number | null;
  onboarded: boolean;
}

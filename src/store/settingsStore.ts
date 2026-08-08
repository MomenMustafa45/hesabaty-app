import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_CURRENCY_CODE } from '@config/currencies';
import { getBootstrapLanguage } from '@locales/i18n';
import {
  AppLanguage,
  CycleType,
  OnboardingDraft,
  SettingsState,
} from '@models/settings';
import { storageKeys } from '@storage/keys';
import { zustandStorage } from '@storage/storage';

interface SettingsActions {
  setCurrency: (currency: string) => void;
  setMonthlyLimit: (monthlyLimit: number) => void;
  setCycleType: (cycleType: CycleType) => void;
  setCycleStartDay: (cycleStartDay: number) => void;
  setLanguage: (language: AppLanguage) => void;
  setOnboardingDraft: (draft: OnboardingDraft | null) => void;
  completeOnboarding: (input: {
    currency: string;
    monthlyLimit: number;
    cycleType: CycleType;
    cycleStartDay: number | null;
  }) => void;
}

export type SettingsStore = SettingsState & SettingsActions;

export const createDefaultOnboardingDraft = (): OnboardingDraft => ({
  step: 'Welcome',
  currency: DEFAULT_CURRENCY_CODE,
  cycleType: 'calendar',
  cycleStartDay: null,
  draftLimitMajor: '6000',
});

const initialState: SettingsState = {
  currency: null,
  monthlyLimit: null,
  cycleType: null,
  cycleStartDay: null,
  onboarded: false,
  language: getBootstrapLanguage(),
  onboardingDraft: null,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      ...initialState,
      setCurrency: currency => set({ currency }),
      setMonthlyLimit: monthlyLimit => set({ monthlyLimit }),
      setCycleType: cycleType => set({ cycleType }),
      setCycleStartDay: cycleStartDay => set({ cycleStartDay }),
      setLanguage: language => set({ language }),
      setOnboardingDraft: onboardingDraft => set({ onboardingDraft }),
      completeOnboarding: input =>
        set({
          currency: input.currency,
          monthlyLimit: input.monthlyLimit,
          cycleType: input.cycleType,
          cycleStartDay: input.cycleStartDay,
          onboarded: true,
          onboardingDraft: null,
        }),
    }),
    {
      name: storageKeys.settings,
      storage: createJSONStorage(() => zustandStorage),
      partialize: state => ({
        currency: state.currency,
        monthlyLimit: state.monthlyLimit,
        cycleType: state.cycleType,
        cycleStartDay: state.cycleStartDay,
        onboarded: state.onboarded,
        language: state.language,
        onboardingDraft: state.onboardingDraft,
      }),
    },
  ),
);

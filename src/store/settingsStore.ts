import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CycleType, SettingsState } from '@models/settings';
import { storageKeys } from '@storage/keys';
import { zustandStorage } from '@storage/storage';

interface SettingsActions {
  setCurrency: (currency: string) => void;
  setMonthlyLimit: (monthlyLimit: number) => void;
  setCycleType: (cycleType: CycleType) => void;
  setCycleStartDay: (cycleStartDay: number) => void;
  completeOnboarding: (input: {
    currency: string;
    monthlyLimit: number;
    cycleType: CycleType;
    cycleStartDay: number | null;
  }) => void;
}

export type SettingsStore = SettingsState & SettingsActions;

const initialState: SettingsState = {
  currency: null,
  monthlyLimit: null,
  cycleType: null,
  cycleStartDay: null,
  onboarded: false,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      ...initialState,
      setCurrency: currency => set({ currency }),
      setMonthlyLimit: monthlyLimit => set({ monthlyLimit }),
      setCycleType: cycleType => set({ cycleType }),
      setCycleStartDay: cycleStartDay => set({ cycleStartDay }),
      completeOnboarding: input =>
        set({
          currency: input.currency,
          monthlyLimit: input.monthlyLimit,
          cycleType: input.cycleType,
          cycleStartDay: input.cycleStartDay,
          onboarded: true,
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
      }),
    },
  ),
);

import { NavigatorScreenParams } from '@react-navigation/native';
import { CycleType } from '@models/settings';

export type AppTabParamList = {
  Home: undefined;
  History: undefined;
  Insights: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  Currency: undefined;
  CycleLimit: undefined;
  Categories: undefined;
  NotificationSettings: undefined;
  ExportImport: undefined;
  About: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  CurrencyStep: undefined;
  CycleAndLimitStep: { currency: string };
  NotificationPermissionStep: {
    currency: string;
    monthlyLimit: number;
    cycleType: CycleType;
    cycleStartDay: number | null;
  };
};

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabParamList>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

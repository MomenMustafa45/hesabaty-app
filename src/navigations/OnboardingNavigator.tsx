import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DEFAULT_CURRENCY_CODE } from '@config/currencies';
import CurrencyStepScreen from '@features/onboarding/screens/CurrencyStepScreen';
import CycleAndLimitStepScreen from '@features/onboarding/screens/CycleAndLimitStepScreen';
import NotificationPermissionStepScreen from '@features/onboarding/screens/NotificationPermissionStepScreen';
import WelcomeScreen from '@features/onboarding/screens/WelcomeScreen';
import { useSettingsStore } from '@store/settingsStore';
import { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  const draft = useSettingsStore(state => state.onboardingDraft);
  const initialRouteName = draft?.step ?? 'Welcome';
  const currency = draft?.currency ?? DEFAULT_CURRENCY_CODE;
  const cycleType = draft?.cycleType ?? 'calendar';
  const cycleStartDay = draft?.cycleStartDay ?? null;
  const draftLimitMajor = Number(draft?.draftLimitMajor ?? '6000');
  const monthlyLimit =
    Number.isFinite(draftLimitMajor) && draftLimitMajor > 0
      ? Math.round(draftLimitMajor * 100)
      : 600000;

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="CurrencyStep" component={CurrencyStepScreen} />
      <Stack.Screen
        name="CycleAndLimitStep"
        component={CycleAndLimitStepScreen}
        initialParams={{ currency }}
      />
      <Stack.Screen
        name="NotificationPermissionStep"
        component={NotificationPermissionStepScreen}
        initialParams={{
          currency,
          monthlyLimit,
          cycleType,
          cycleStartDay,
        }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;

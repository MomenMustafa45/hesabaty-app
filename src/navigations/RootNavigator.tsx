import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RolloverHost } from '@features/rollover/components/RolloverHost';
import { TransactionSheetHost } from '@features/transactions/components/TransactionSheetHost';
import NotificationsLifecycle from '@providers/NotificationsLifecycle';
import { useSettingsStore } from '@store/settingsStore';
import { AppNavigator } from './AppNavigator';
import { buildRootOnboardingInitialState } from './onboardingResumeState';
import { OnboardingNavigator } from './OnboardingNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Assumes MMKV hydration completed (see SplashGate). */
export const RootNavigator: React.FC = () => {
  const onboarded = useSettingsStore(state => state.onboarded);
  const onboardingDraft = useSettingsStore(state => state.onboardingDraft);

  const navigationInitialState = onboarded
    ? undefined
    : buildRootOnboardingInitialState(onboardingDraft);

  return (
    <NavigationContainer initialState={navigationInitialState}>
      <>
        <Stack.Navigator
          key={onboarded ? 'main' : 'onboarding'}
          screenOptions={{ headerShown: false }}>
          {onboarded ? (
            <Stack.Screen name="AppTabs" component={AppNavigator} />
          ) : (
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
          )}
        </Stack.Navigator>
        {onboarded ? <TransactionSheetHost /> : null}
        {onboarded ? <RolloverHost /> : null}
        {onboarded ? <NotificationsLifecycle /> : null}
      </>
    </NavigationContainer>
  );
};

export default RootNavigator;

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RolloverHost } from '@features/rollover/components/RolloverHost';
import { TransactionSheetHost } from '@features/transactions/components/TransactionSheetHost';
import { useTheme } from '@providers/ThemeProvider';
import { useSettingsStore } from '@store/settingsStore';
import { AppNavigator } from './AppNavigator';
import { buildRootOnboardingInitialState } from './onboardingResumeState';
import { OnboardingNavigator } from './OnboardingNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const onboarded = useSettingsStore(state => state.onboarded);
  const onboardingDraft = useSettingsStore(state => state.onboardingDraft);
  const [hasHydrated, setHasHydrated] = useState(
    useSettingsStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubscribe = useSettingsStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    setHasHydrated(useSettingsStore.persist.hasHydrated());
    return unsubscribe;
  }, []);

  if (!hasHydrated) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.sand }} />;
  }

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
      </>
    </NavigationContainer>
  );
};

export default RootNavigator;

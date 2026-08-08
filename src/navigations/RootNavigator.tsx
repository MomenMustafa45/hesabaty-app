import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddTransactionSheet from '@features/transactions/screens/AddTransactionSheet';
import { useTheme } from '@providers/ThemeProvider';
import { useSettingsStore } from '@store/settingsStore';
import { AppNavigator } from './AppNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const onboarded = useSettingsStore(state => state.onboarded);
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

  return (
    <NavigationContainer>
      <Stack.Navigator
        key={onboarded ? 'main' : 'onboarding'}
        screenOptions={{ headerShown: false }}>
        {onboarded ? (
          <>
            <Stack.Screen name="AppTabs" component={AppNavigator} />
            <Stack.Screen
              name="AddTransactionSheet"
              component={AddTransactionSheet}
              options={{ presentation: 'modal' }}
            />
          </>
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

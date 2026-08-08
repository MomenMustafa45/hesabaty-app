import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CurrencyStepScreen from '@features/onboarding/screens/CurrencyStepScreen';
import CycleAndLimitStepScreen from '@features/onboarding/screens/CycleAndLimitStepScreen';
import NotificationPermissionStepScreen from '@features/onboarding/screens/NotificationPermissionStepScreen';
import WelcomeScreen from '@features/onboarding/screens/WelcomeScreen';
import { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="CurrencyStep" component={CurrencyStepScreen} />
    <Stack.Screen name="CycleAndLimitStep" component={CycleAndLimitStepScreen} />
    <Stack.Screen
      name="NotificationPermissionStep"
      component={NotificationPermissionStepScreen}
    />
  </Stack.Navigator>
);

export default OnboardingNavigator;

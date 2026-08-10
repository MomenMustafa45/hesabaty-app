import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AboutScreen from '@features/settings/screens/AboutScreen';
import CategoriesScreen from '@features/settings/screens/CategoriesScreen';
import CurrencyScreen from '@features/settings/screens/CurrencyScreen';
import CycleLimitScreen from '@features/settings/screens/CycleLimitScreen';
import ExportImportScreen from '@features/settings/screens/ExportImportScreen';
import NotificationSettingsScreen from '@features/settings/screens/NotificationSettingsScreen';
import SettingsScreen from '@features/settings/screens/SettingsScreen';
import { SettingsStackParamList } from './types';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SettingsHome" component={SettingsScreen} />
    <Stack.Screen name="Currency" component={CurrencyScreen} />
    <Stack.Screen name="CycleLimit" component={CycleLimitScreen} />
    <Stack.Screen name="Categories" component={CategoriesScreen} />
    <Stack.Screen
      name="NotificationSettings"
      component={NotificationSettingsScreen}
    />
    <Stack.Screen name="ExportImport" component={ExportImportScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
  </Stack.Navigator>
);

export default SettingsNavigator;

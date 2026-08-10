import React from 'react';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import HistoryScreen from '@features/history/screens/HistoryScreen';
import HomeScreen from '@features/home/screens/HomeScreen';
import InsightsScreen from '@features/insights/screens/InsightsScreen';
import { useTheme } from '@providers/ThemeProvider';
import { SettingsNavigator } from './SettingsNavigator';
import { tabBarIcons } from './tabBarIcons';
import { AppTabParamList } from './types';

const Tab = createNativeBottomTabNavigator<AppTabParamList>();

export const AppNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.nile,
        tabBarInactiveTintColor: theme.colors.ink3,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: tabBarIcons.home }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarIcon: tabBarIcons.history }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{ tabBarIcon: tabBarIcons.insights }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{ tabBarIcon: tabBarIcons.settings }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;

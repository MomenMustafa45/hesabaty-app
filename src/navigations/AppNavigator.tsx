import React from 'react';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import HistoryScreen from '@features/history/screens/HistoryScreen';
import InsightsScreen from '@features/insights/screens/InsightsScreen';
import SettingsScreen from '@features/settings/screens/SettingsScreen';
import { useTheme } from '@providers/ThemeProvider';
// TODO(M3 verify): temporary — restore HomeScreen import and swap the Home
// tab component back once DebugDataScreen verification is done.
import DebugDataScreen from '../../DebugDataScreen';
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
      }}
    >
      <Tab.Screen
        name="Home"
        component={DebugDataScreen}
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
        component={SettingsScreen}
        options={{ tabBarIcon: tabBarIcons.settings }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;

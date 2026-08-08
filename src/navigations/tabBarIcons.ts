import { Platform } from 'react-native';
import type { NativeBottomTabIcon } from '@react-navigation/bottom-tabs/unstable';

const homeIcon = Platform.select<NativeBottomTabIcon | undefined>({
  ios: { type: 'sfSymbol', name: 'house' },
  default: require('@assets/icons/home.png'),
});

const historyIcon = Platform.select<NativeBottomTabIcon | undefined>({
  ios: { type: 'sfSymbol', name: 'newspaper' },
  default: require('@assets/icons/history.png'),
});

const chart = Platform.select<NativeBottomTabIcon | undefined>({
  ios: { type: 'sfSymbol', name: 'magnifyingglass' },
  default: require('@assets/icons/chart.png'),
});

const gear = Platform.select<NativeBottomTabIcon | undefined>({
  ios: { type: 'sfSymbol', name: 'person' },
  default: require('@assets/icons/gear.png'),
});

export const tabBarIcons = {
  home: homeIcon,
  history: historyIcon,
  insights: chart,
  settings: gear,
} as const;

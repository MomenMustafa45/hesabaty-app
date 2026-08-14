import { Platform } from 'react-native';
import type { NativeBottomTabIcon } from '@react-navigation/bottom-tabs/unstable';

const homeIcon = Platform.select<NativeBottomTabIcon | undefined>({
  ios: { type: 'sfSymbol', name: 'house' },
  android: {
    type: 'image',
    source: require('../assets/icons/houseSymbol.png'),
  },
});

const historyIcon = Platform.select<NativeBottomTabIcon | undefined>({
  ios: {
    type: 'sfSymbol',
    name: 'clock.arrow.trianglehead.counterclockwise.rotate.90',
  },
  android: {
    type: 'image',
    source: require('../assets/icons/historySymbol.png'),
  },
});

const chart = Platform.select<NativeBottomTabIcon | undefined>({
  ios: { type: 'sfSymbol', name: 'chart.bar' },
  android: {
    type: 'image',
    source: require('../assets/icons/chartSymbol.png'),
  },
});

const gear = Platform.select<NativeBottomTabIcon | undefined>({
  ios: { type: 'sfSymbol', name: 'gear' },
  android: {
    type: 'image',
    source: require('../assets/icons/gearSymbol.png'),
  },
});

export const tabBarIcons = {
  home: homeIcon,
  history: historyIcon,
  insights: chart,
  settings: gear,
} as const;

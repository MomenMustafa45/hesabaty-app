import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { splashColors } from '@features/splash/splashConstants';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: splashColors.bgDeep,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 56,
      paddingHorizontal: 24,
    },
    titleBlock: {
      alignItems: 'center',
      gap: 16,
    },
    title: {
      fontSize: 44,
      fontFamily: theme.fontFamilyByWeight[600],
      color: '#FFFFFF',
      textAlign: 'center',
    },
    rule: {
      width: 44,
      height: 2,
      backgroundColor: splashColors.gold,
    },
    tagline: {
      fontSize: 11,
      fontFamily: theme.fontFamilyByWeight[600],
      color: 'rgba(255,255,255,0.6)',
      letterSpacing: 4.8,
      textTransform: 'uppercase',
      textAlign: 'center',
    },
  });

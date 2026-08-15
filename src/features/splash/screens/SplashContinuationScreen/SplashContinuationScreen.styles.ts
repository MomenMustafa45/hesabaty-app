import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { splashColors } from '@features/splash/splashConstants';
import { scale, verticalScale, moderateScale } from '@config/scaling';

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
      gap: moderateScale(56),
      paddingHorizontal: scale(24),
    },
    titleBlock: {
      alignItems: 'center',
      gap: moderateScale(16),
    },
    title: {
      fontSize: moderateScale(44),
      fontFamily: theme.fontFamilyByWeight[600],
      color: '#FFFFFF',
      textAlign: 'center',
    },
    rule: {
      width: scale(44),
      height: verticalScale(2),
      backgroundColor: splashColors.gold,
    },
    tagline: {
      fontSize: moderateScale(11),
      fontFamily: theme.fontFamilyByWeight[600],
      color: 'rgba(255,255,255,0.6)',
      letterSpacing: moderateScale(4.8),
      textTransform: 'uppercase',
      textAlign: 'center',
    },
  });

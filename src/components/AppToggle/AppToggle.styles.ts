import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    track: {
      width: scale(44),
      height: scale(26),
      borderRadius: theme.radii.pill,
      backgroundColor: theme.colors.line,
      justifyContent: 'center',
    },
    trackOn: {
      backgroundColor: theme.colors.nile,
    },
    knob: {
      position: 'absolute',
      top: scale(3),
      left: scale(3),
      width: scale(20),
      height: scale(20),
      borderRadius: moderateScale(10),
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: moderateScale(3),
      shadowOffset: { width: 0, height: verticalScale(1) },
      elevation: 2,
    },
  });

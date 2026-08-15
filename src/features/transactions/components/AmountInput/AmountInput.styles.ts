import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrap: {
      alignItems: 'center',
      paddingVertical: verticalScale(14),
      paddingBottom: verticalScale(6),
    },
    input: {
      width: '100%',
      borderWidth: 0,
      fontSize: moderateScale(38),
      fontFamily: theme.fontFamilyByWeight[700],
      textAlign: 'center',
      backgroundColor: 'transparent',
      color: theme.colors.ink,
      padding: 0,
    },
    currencyCode: {
      marginTop: verticalScale(2),
      fontSize: moderateScale(13),
      fontFamily: theme.fontFamilyByWeight[600],
      color: theme.colors.ink3,
    },
  });

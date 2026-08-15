import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    track: {
      flexDirection: 'row',
      backgroundColor: theme.colors.sand,
      borderRadius: theme.radii.pill,
      padding: moderateScale(4),
      borderWidth: 1,
      borderColor: theme.colors.line,
    },
    option: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalScale(11),
      borderRadius: theme.radii.pill,
    },
    optionSelected: {
      backgroundColor: theme.colors.sand2,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: moderateScale(6),
      shadowOffset: { width: 0, height: verticalScale(2) },
      elevation: 2,
    },
    label: {
      fontSize: moderateScale(13),
      fontFamily: theme.fontFamilyByWeight[600],
      color: theme.colors.ink2,
    },
    labelSelected: {
      color: theme.colors.ink,
    },
  });

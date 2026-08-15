import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    seg: {
      flexDirection: 'row',
      backgroundColor: theme.colors.sand,
      borderRadius: theme.radii.pill,
      padding: moderateScale(4),
      borderWidth: 1,
      borderColor: theme.colors.line,
    },
    option: {
      paddingVertical: verticalScale(8),
      paddingHorizontal: scale(12),
      borderRadius: theme.radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionActive: {
      backgroundColor: theme.colors.sand2,
      shadowColor: '#000000',
      shadowOpacity: 0.08,
      shadowRadius: moderateScale(6),
      shadowOffset: { width: 0, height: verticalScale(2) },
      elevation: 2,
    },
    optionText: {
      fontSize: moderateScale(13),
      fontWeight: '600',
      color: theme.colors.ink2,
    },
    optionTextActive: {
      color: theme.colors.ink,
    },
  });

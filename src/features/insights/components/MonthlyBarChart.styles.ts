import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      padding: theme.spacing.cardPadding,
      marginBottom: verticalScale(18),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: verticalScale(120),
      gap: moderateScale(8),
    },
    column: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: moderateScale(6),
    },
    bar: {
      width: '60%',
      borderTopLeftRadius: moderateScale(6),
      borderTopRightRadius: moderateScale(6),
      borderBottomLeftRadius: moderateScale(2),
      borderBottomRightRadius: moderateScale(2),
    },
    monthLabel: {
      marginTop: 0,
    },
  });

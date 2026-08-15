import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.cardPadding,
    },
    chipsRow: {
      flexDirection: 'row',
      gap: moderateScale(10),
      marginBottom: verticalScale(8),
    },
    chipHint: {
      marginBottom: verticalScale(18),
    },
    field: {
      marginBottom: verticalScale(14),
    },
    doneButton: {
      marginTop: verticalScale(8),
    },
  });

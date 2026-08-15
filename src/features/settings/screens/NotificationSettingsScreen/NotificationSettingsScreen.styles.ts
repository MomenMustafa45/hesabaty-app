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
    contentContainer: {
      paddingBottom: verticalScale(40),
    },
    card: {
      marginBottom: verticalScale(16),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: moderateScale(12),
    },
    rowText: {
      flex: 1,
      gap: moderateScale(2),
    },
    timeRow: {
      marginTop: verticalScale(14),
      paddingTop: verticalScale(14),
      borderTopWidth: 1,
      borderTopColor: theme.colors.line,
    },
  });

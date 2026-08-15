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
    warningCard: {
      borderColor: theme.colors.gold,
      backgroundColor: theme.colors.goldLight,
      marginBottom: verticalScale(14),
    },
    warningTitle: {
      marginBottom: verticalScale(6),
    },
    warningBody: {
      lineHeight: theme.lineHeights.compact,
      marginBottom: verticalScale(14),
    },
    warningActions: {
      flexDirection: 'row',
      gap: moderateScale(10),
    },
    warningButton: {
      flex: 1,
    },
  });

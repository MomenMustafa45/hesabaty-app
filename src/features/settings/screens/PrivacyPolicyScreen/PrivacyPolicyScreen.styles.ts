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
      paddingBottom: theme.spacing.tabBarClearance,
    },
    contentContainer: {
      paddingBottom: verticalScale(40),
      gap: moderateScale(12),
    },
    card: {
      gap: moderateScale(8),
    },
    sectionTitle: {
      marginBottom: verticalScale(2),
    },
    body: {
      lineHeight: theme.lineHeights.body,
    },
    lastUpdated: {
      marginBottom: verticalScale(4),
    },
  });

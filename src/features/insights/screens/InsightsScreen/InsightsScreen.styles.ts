import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { verticalScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
    },
    content: {
      paddingHorizontal: theme.spacing.cardPadding,
      paddingBottom: theme.spacing.tabBarClearance,
    },
    title: {
      paddingTop: verticalScale(14),
      paddingBottom: verticalScale(16),
    },
    sectionTitle: {
      marginBottom: verticalScale(10),
    },
  });

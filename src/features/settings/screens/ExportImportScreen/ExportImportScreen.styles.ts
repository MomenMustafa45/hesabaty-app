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
      flex: 1,
      paddingHorizontal: theme.spacing.cardPadding,
    },
    sectionTitle: {
      marginBottom: verticalScale(8),
    },
    body: {
      lineHeight: theme.lineHeights.body,
      marginBottom: verticalScale(14),
    },
    actionButton: {
      marginBottom: verticalScale(8),
    },
    comingSoon: {
      marginTop: verticalScale(20),
      textAlign: 'center',
    },
  });

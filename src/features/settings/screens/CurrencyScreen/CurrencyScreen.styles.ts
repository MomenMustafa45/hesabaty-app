import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

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
      marginBottom: 14,
    },
    warningTitle: {
      marginBottom: 6,
    },
    warningBody: {
      lineHeight: 17,
      marginBottom: 14,
    },
    warningActions: {
      flexDirection: 'row',
      gap: 10,
    },
    warningButton: {
      flex: 1,
    },
  });

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
    sectionTitle: {
      marginBottom: 8,
    },
    body: {
      lineHeight: 22,
      marginBottom: 14,
    },
    actionButton: {
      marginBottom: 8,
    },
    comingSoon: {
      marginTop: 20,
      textAlign: 'center',
    },
  });

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
      paddingBottom: 120,
    },
    contentContainer: {
      paddingBottom: 40,
      gap: 12,
    },
    card: {
      gap: 8,
    },
    sectionTitle: {
      marginBottom: 2,
    },
    body: {
      lineHeight: 22,
    },
    lastUpdated: {
      marginBottom: 4,
    },
  });

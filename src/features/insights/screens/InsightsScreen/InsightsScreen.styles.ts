import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
    },
    content: {
      paddingHorizontal: theme.spacing.cardPadding,
      paddingBottom: 120,
    },
    title: {
      paddingTop: 14,
      paddingBottom: 16,
    },
    sectionTitle: {
      marginBottom: 10,
    },
  });

import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
    },
    content: {
      padding: theme.spacing.cardPadding,
      paddingBottom: 40,
      gap: 16,
    },
    section: {
      gap: 8,
    },
    row: {
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radiusSm,
      padding: 12,
      gap: 2,
    },
    colorDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    rowHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    empty: {
      color: theme.colors.ink3,
    },
  });

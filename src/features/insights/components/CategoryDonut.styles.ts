import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      padding: theme.spacing.cardPadding,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
    legend: {
      flex: 1,
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 9,
    },
    legendLeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },
    swatch: {
      width: 8,
      height: 8,
      borderRadius: 2,
    },
  });

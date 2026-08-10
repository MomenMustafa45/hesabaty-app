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
      marginBottom: 18,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 120,
      gap: 8,
    },
    column: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 6,
    },
    bar: {
      width: '60%',
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 2,
    },
    monthLabel: {
      marginTop: 0,
    },
  });

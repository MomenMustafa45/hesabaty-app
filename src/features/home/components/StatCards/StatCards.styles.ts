import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 16,
    },
    card: {
      flex: 1,
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radiusSm,
      padding: 14,
    },
    value: {
      fontSize: 18,
      fontFamily: theme.fontFamilyByWeight[700],
      marginTop: 2,
    },
  });

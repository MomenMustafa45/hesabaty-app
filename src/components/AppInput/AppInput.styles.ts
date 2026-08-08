import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 12,
      fontFamily: theme.fontFamilyByWeight[600],
      color: theme.colors.ink2,
      marginBottom: 8,
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radiusSm,
      paddingVertical: theme.spacing.inputPaddingVertical,
      paddingHorizontal: theme.spacing.inputPaddingHorizontal,
      fontFamily: theme.fontFamilyByWeight[400],
      fontSize: 15,
      backgroundColor: theme.colors.sand2,
      color: theme.colors.ink,
    },
    inputFocused: {
      borderColor: theme.colors.nile,
    },
  });

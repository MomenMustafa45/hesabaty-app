import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: theme.radii.radiusSm,
      paddingVertical: theme.spacing.buttonPaddingVertical,
      paddingHorizontal: theme.spacing.buttonPaddingHorizontal,
    },
    fullWidth: {
      width: '100%',
    },
    primary: {
      backgroundColor: theme.colors.nile,
    },
    primaryPressed: {
      backgroundColor: theme.colors.nileDark,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.line,
    },
    disabled: {
      opacity: 0.4,
    },
    label: {
      fontSize: 15,
      fontFamily: theme.fontFamilyByWeight[600],
    },
    primaryLabel: {
      color: '#fff',
    },
    ghostLabel: {
      color: theme.colors.ink2,
    },
  });

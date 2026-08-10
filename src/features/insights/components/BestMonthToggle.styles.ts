import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    toggle: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    toggleBtn: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.line,
      backgroundColor: theme.colors.sand2,
      paddingVertical: 10,
      borderRadius: theme.radii.radiusSm,
      alignItems: 'center',
    },
    toggleBtnActive: {
      borderColor: theme.colors.gold,
      backgroundColor: theme.colors.goldLight,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      padding: theme.spacing.cardPadding,
      marginBottom: 6,
    },
    mark: {
      width: 38,
      height: 38,
      borderRadius: theme.radii.radiusSm,
      backgroundColor: theme.colors.gold,
      alignItems: 'center',
      justifyContent: 'center',
    },
    markText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    caption: {
      marginBottom: 20,
    },
  });

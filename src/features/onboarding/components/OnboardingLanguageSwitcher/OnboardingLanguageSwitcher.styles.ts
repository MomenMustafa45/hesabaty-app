import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    seg: {
      flexDirection: 'row',
      backgroundColor: theme.colors.sand,
      borderRadius: 999,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.line,
    },
    option: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionActive: {
      backgroundColor: theme.colors.sand2,
      shadowColor: '#000000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    optionText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.ink2,
    },
    optionTextActive: {
      color: theme.colors.ink,
    },
  });

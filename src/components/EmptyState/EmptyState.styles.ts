import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: 50,
      paddingHorizontal: 10,
    },
    mark: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    title: {
      marginBottom: 4,
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
    },
  });

import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
      paddingHorizontal: 24,
      paddingBottom: 32,
    },
    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
    },
    mark: {
      width: 76,
      height: 76,
      borderRadius: 22,
      backgroundColor: theme.colors.gold,
      alignItems: 'center',
      justifyContent: 'center',
    },
    subtitle: {
      maxWidth: 280,
      textAlign: 'center',
      lineHeight: 22,
    },
    actions: {
      gap: 10,
    },
  });

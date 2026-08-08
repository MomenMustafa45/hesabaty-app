import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (_theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 8,
      paddingVertical: 2,
    },
  });

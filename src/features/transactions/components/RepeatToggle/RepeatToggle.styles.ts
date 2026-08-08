import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (_theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginTop: 4,
    },
    copy: {
      flex: 1,
      gap: 2,
    },
  });

import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
    },
    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.line,
    },
    leading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconWrap: {
      width: 30,
      height: 30,
      borderRadius: theme.radii.radiusSm,
      backgroundColor: theme.colors.sand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    trailing: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });

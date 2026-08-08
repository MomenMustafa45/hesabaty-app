import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 6,
      marginBottom: 8,
    },
    headSpacer: {
      width: 34,
    },
    closeBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
    },
    field: {
      marginTop: 12,
      gap: 8,
    },
    fieldLabel: {
      marginBottom: 2,
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 14,
    },
    actionFlex: {
      flex: 1,
    },
    deleteGhost: {
      borderColor: theme.colors.coralLight,
    },
  });

import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrap: {
      alignItems: 'center',
      paddingVertical: 14,
      paddingBottom: 6,
    },
    input: {
      width: '100%',
      borderWidth: 0,
      fontSize: 38,
      fontFamily: theme.fontFamilyByWeight[700],
      textAlign: 'center',
      backgroundColor: 'transparent',
      color: theme.colors.ink,
      padding: 0,
    },
    currencyCode: {
      marginTop: 2,
      fontSize: 13,
      fontFamily: theme.fontFamilyByWeight[600],
      color: theme.colors.ink3,
    },
  });

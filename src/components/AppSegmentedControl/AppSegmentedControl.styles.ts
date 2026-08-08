import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    track: {
      flexDirection: 'row',
      backgroundColor: theme.colors.sand,
      borderRadius: theme.radii.pill,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.line,
    },
    option: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 11,
      borderRadius: theme.radii.pill,
    },
    optionSelected: {
      backgroundColor: theme.colors.sand2,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    label: {
      fontSize: 13,
      fontFamily: theme.fontFamilyByWeight[600],
      color: theme.colors.ink2,
    },
    labelSelected: {
      color: theme.colors.ink,
    },
  });

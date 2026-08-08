import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: theme.spacing.chipPaddingVertical,
      paddingHorizontal: theme.spacing.chipPaddingHorizontal,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      borderColor: theme.colors.line,
      backgroundColor: theme.colors.sand2,
      alignSelf: 'flex-start',
    },
    selected: {
      borderColor: theme.colors.nile,
      backgroundColor: theme.colors.nile,
    },
    label: {
      fontSize: 13,
      fontFamily: theme.fontFamilyByWeight[600],
      color: theme.colors.ink,
    },
    labelSelected: {
      color: '#fff',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });

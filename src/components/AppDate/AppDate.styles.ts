import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 12,
      fontFamily: theme.fontFamilyByWeight[600],
      color: theme.colors.ink2,
      marginBottom: 8,
    },
    field: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radiusSm,
      paddingVertical: theme.spacing.inputPaddingVertical,
      paddingHorizontal: theme.spacing.inputPaddingHorizontal,
      backgroundColor: theme.colors.sand2,
    },
    fieldOpen: {
      borderColor: theme.colors.nile,
    },
    iosPickerContainer: {
      marginTop: 8,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radiusSm,
      backgroundColor: theme.colors.sand2,
      overflow: 'hidden',
    },
    iosPickerActions: {
      flexDirection: 'row',
      gap: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
    iosPickerButton: {
      flex: 1,
    },
  });

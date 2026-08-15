import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: verticalScale(16),
    },
    label: {
      fontSize: moderateScale(12),
      fontFamily: theme.fontFamilyByWeight[600],
      color: theme.colors.ink2,
      marginBottom: verticalScale(8),
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
      marginTop: verticalScale(8),
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radiusSm,
      backgroundColor: theme.colors.sand2,
      overflow: 'hidden',
    },
    iosPickerActions: {
      flexDirection: 'row',
      gap: moderateScale(10),
      paddingHorizontal: scale(10),
      paddingBottom: verticalScale(10),
    },
    iosPickerButton: {
      flex: 1,
    },
  });

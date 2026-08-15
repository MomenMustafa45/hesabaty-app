import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(6),
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
      fontSize: moderateScale(13),
      fontFamily: theme.fontFamilyByWeight[600],
      color: theme.colors.ink,
    },
    labelSelected: {
      color: '#fff',
    },
    dot: {
      width: scale(8),
      height: scale(8),
      borderRadius: moderateScale(4),
    },
  });

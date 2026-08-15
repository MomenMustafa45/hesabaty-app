import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: moderateScale(6),
      justifyContent: 'center',
    },
    dot: {
      width: scale(6),
      height: scale(6),
      borderRadius: moderateScale(3),
      backgroundColor: theme.colors.line,
    },
    dotActive: {
      width: scale(18),
      borderRadius: moderateScale(4),
      backgroundColor: theme.colors.nile,
    },
  });

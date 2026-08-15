import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(12),
      paddingVertical: verticalScale(12),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.line,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    catDot: {
      width: scale(38),
      height: scale(38),
      borderRadius: moderateScale(12),
      alignItems: 'center',
      justifyContent: 'center',
    },
    mid: {
      flex: 1,
      minWidth: 0,
      gap: moderateScale(1),
    },
  });

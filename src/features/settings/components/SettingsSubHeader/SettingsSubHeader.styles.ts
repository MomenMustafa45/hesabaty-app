import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(12),
      paddingTop: verticalScale(14),
      paddingBottom: verticalScale(20),
    },
    backBtn: {
      width: scale(38),
      height: scale(38),
      borderRadius: moderateScale(19),
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

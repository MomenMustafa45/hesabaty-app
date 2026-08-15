import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: verticalScale(6),
      marginBottom: verticalScale(8),
    },
    headSpacer: {
      width: scale(34),
    },
    closeBtn: {
      width: scale(34),
      height: scale(34),
      borderRadius: moderateScale(17),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
    },
    jumpRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: verticalScale(13),
      paddingHorizontal: scale(14),
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radiusSm,
      marginBottom: verticalScale(14),
      backgroundColor: theme.colors.sand2,
    },
  });

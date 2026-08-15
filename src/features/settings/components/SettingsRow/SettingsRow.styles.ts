import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: verticalScale(14),
    },
    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.line,
    },
    leading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(12),
    },
    iconWrap: {
      width: scale(30),
      height: scale(30),
      borderRadius: theme.radii.radiusSm,
      backgroundColor: theme.colors.sand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    trailing: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(8),
    },
  });

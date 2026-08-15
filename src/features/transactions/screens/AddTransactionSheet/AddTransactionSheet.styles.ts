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
    field: {
      marginTop: verticalScale(12),
      gap: moderateScale(8),
    },
    fieldLabel: {
      marginBottom: verticalScale(2),
    },
    actions: {
      flexDirection: 'row',
      gap: moderateScale(10),
      marginTop: verticalScale(14),
    },
    actionFlex: {
      flex: 1,
    },
    deleteGhost: {
      borderColor: theme.colors.coralLight,
    },
  });

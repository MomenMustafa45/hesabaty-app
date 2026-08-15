import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
    },
    content: {
      paddingHorizontal: theme.spacing.cardPadding,
      paddingBottom: theme.spacing.tabBarClearance,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: verticalScale(14),
      paddingBottom: verticalScale(16),
    },
    iconBtn: {
      width: scale(38),
      height: scale(38),
      borderRadius: moderateScale(19),
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBtnDisabled: {
      opacity: 0.3,
    },
    monthBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(5),
    },
    dayGroup: {
      marginBottom: verticalScale(4),
    },
    dayLabel: {
      marginTop: verticalScale(14),
      marginBottom: verticalScale(4),
    },
    dayCard: {
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(4),
    },
  });

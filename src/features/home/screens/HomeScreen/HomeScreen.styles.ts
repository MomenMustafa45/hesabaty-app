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
      paddingBottom: verticalScale(145),
      gap: 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: verticalScale(10),
      paddingBottom: verticalScale(16),
    },
    greet: {
      gap: moderateScale(2),
    },
    sectionHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: verticalScale(6),
      marginBottom: verticalScale(10),
    },
    seeAll: {
      fontSize: moderateScale(12.5),
      fontFamily: theme.fontFamilyByWeight[600],
      color: theme.colors.nile,
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing.tabBarClearance,
      // `end` flips with RTL (physical right in LTR, physical left in RTL).
      // Do not use left/right + I18nManager.isRTL — that combination stayed
      // stuck on the physical right during M5 RTL verification.
      end: scale(20),
      width: scale(56),
      height: scale(56),
      borderRadius: moderateScale(28),
      backgroundColor: theme.colors.gold,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.gold,
      shadowOpacity: 0.45,
      shadowRadius: moderateScale(22),
      shadowOffset: { width: 0, height: verticalScale(10) },
      elevation: 8,
    },
  });

import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.nile,
      borderRadius: theme.radii.radius,
      padding: moderateScale(22),
      marginBottom: verticalScale(14),
      overflow: 'hidden',
    },
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(18),
    },
    figures: {
      flex: 1,
      gap: moderateScale(2),
    },
    big: {
      fontSize: moderateScale(26),
      fontFamily: theme.fontFamilyByWeight[700],
      color: theme.ringColors.ringSafe,
    },
    cap: {
      fontSize: moderateScale(12),
      fontFamily: theme.fontFamilyByWeight[400],
      color: theme.ringColors.ringSafe,
      opacity: 0.75,
    },
    legend: {
      flexDirection: 'row',
      gap: moderateScale(14),
      marginTop: verticalScale(14),
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(6),
    },
    legendText: {
      fontSize: moderateScale(11),
      fontFamily: theme.fontFamilyByWeight[400],
      color: theme.ringColors.ringSafe,
      opacity: 0.85,
    },
    swatch: {
      width: scale(8),
      height: scale(8),
      borderRadius: moderateScale(2),
    },
  });

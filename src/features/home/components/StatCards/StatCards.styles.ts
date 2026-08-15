import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      gap: moderateScale(10),
      marginBottom: verticalScale(16),
    },
    card: {
      flex: 1,
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radiusSm,
      padding: moderateScale(14),
    },
    value: {
      fontSize: moderateScale(18),
      fontFamily: theme.fontFamilyByWeight[700],
      marginTop: verticalScale(2),
    },
  });

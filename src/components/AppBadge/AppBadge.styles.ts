import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(4),
      alignSelf: 'flex-start',
      paddingVertical: verticalScale(2),
      paddingHorizontal: scale(7),
      borderRadius: theme.radii.pill,
    },
    label: {
      fontSize: moderateScale(11),
      fontFamily: theme.fontFamilyByWeight[700],
    },
  });

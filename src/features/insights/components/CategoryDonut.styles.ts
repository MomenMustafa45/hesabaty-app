import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      padding: theme.spacing.cardPadding,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(18),
    },
    legend: {
      flex: 1,
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: verticalScale(9),
    },
    legendLeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(9),
    },
    swatch: {
      width: scale(8),
      height: scale(8),
      borderRadius: moderateScale(2),
    },
  });

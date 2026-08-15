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
    title: {
      paddingTop: verticalScale(14),
      paddingBottom: verticalScale(16),
    },
    card: {
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      paddingHorizontal: theme.spacing.cardPadding,
      marginBottom: verticalScale(16),
    },
    /** Matches the prototype's `.seg` width on Appearance/Language rows. */
    segmentWrap: {
      width: scale(132),
    },
    prototypeLabel: {
      marginTop: verticalScale(4),
      marginBottom: verticalScale(8),
      marginHorizontal: scale(4),
      textTransform: 'uppercase',
      letterSpacing: moderateScale(0.4),
    },
  });

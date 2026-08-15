import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    toggle: {
      flexDirection: 'row',
      gap: moderateScale(8),
      marginBottom: verticalScale(16),
    },
    toggleBtn: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.line,
      backgroundColor: theme.colors.sand2,
      paddingVertical: verticalScale(10),
      borderRadius: theme.radii.radiusSm,
      alignItems: 'center',
    },
    toggleBtnActive: {
      borderColor: theme.colors.gold,
      backgroundColor: theme.colors.goldLight,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(12),
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      padding: theme.spacing.cardPadding,
      marginBottom: verticalScale(6),
    },
    mark: {
      width: scale(38),
      height: scale(38),
      borderRadius: theme.radii.radiusSm,
      backgroundColor: theme.colors.gold,
      alignItems: 'center',
      justifyContent: 'center',
    },
    markText: {
      color: '#FFFFFF',
      fontSize: moderateScale(16),
    },
    caption: {
      marginBottom: verticalScale(20),
    },
  });

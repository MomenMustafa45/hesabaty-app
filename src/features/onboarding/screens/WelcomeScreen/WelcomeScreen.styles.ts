import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
      paddingHorizontal: scale(24),
      paddingBottom: verticalScale(32),
    },
    topBar: {
      position: 'relative',
      minHeight: verticalScale(36),
      justifyContent: 'center',
      marginBottom: verticalScale(22),
    },
    langSlot: {
      position: 'absolute',
      end: 0,
      top: 0,
      zIndex: 1,
    },
    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: moderateScale(18),
    },
    mark: {
      width: scale(76),
      height: scale(76),
      borderRadius: moderateScale(22),
      backgroundColor: theme.colors.nile,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleBlock: {
      alignItems: 'center',
      gap: moderateScale(4),
    },
    subtitle: {
      maxWidth: scale(280),
      textAlign: 'center',
      lineHeight: theme.lineHeights.body,
    },
  });

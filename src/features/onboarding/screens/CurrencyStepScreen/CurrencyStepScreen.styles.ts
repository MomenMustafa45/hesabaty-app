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
    content: {
      flex: 1,
      paddingTop: verticalScale(12),
      gap: moderateScale(8),
    },
    subtitle: {
      marginBottom: verticalScale(8),
    },
    actions: {
      flexDirection: 'row',
      gap: moderateScale(10),
      marginTop: verticalScale(16),
    },
    backButton: {
      width: 'auto',
      paddingHorizontal: scale(20),
      flexGrow: 0,
    },
    continueButton: {
      flex: 1,
    },
  });

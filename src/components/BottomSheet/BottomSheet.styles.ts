import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.overlay,
    },
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight: '88%',
      backgroundColor: theme.colors.sand2,
      borderTopLeftRadius: theme.radii.sheetRadius,
      borderTopRightRadius: theme.radii.sheetRadius,
    },
    handle: {
      width: scale(36),
      height: verticalScale(4),
      borderRadius: moderateScale(4),
      backgroundColor: theme.colors.line,
      alignSelf: 'center',
      marginTop: verticalScale(10),
      marginBottom: verticalScale(4),
    },
    scroll: {
      flexGrow: 0,
    },
    body: {
      paddingHorizontal: scale(20),
      paddingTop: verticalScale(6),
      paddingBottom: verticalScale(28),
      gap: moderateScale(12),
    },
  });

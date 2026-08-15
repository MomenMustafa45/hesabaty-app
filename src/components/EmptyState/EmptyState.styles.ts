import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: verticalScale(50),
      paddingHorizontal: scale(10),
    },
    mark: {
      width: scale(56),
      height: scale(56),
      borderRadius: moderateScale(16),
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: verticalScale(14),
    },
    title: {
      marginBottom: verticalScale(4),
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
    },
  });

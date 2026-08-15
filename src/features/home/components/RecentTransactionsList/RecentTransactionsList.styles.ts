import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(4),
    },
  });

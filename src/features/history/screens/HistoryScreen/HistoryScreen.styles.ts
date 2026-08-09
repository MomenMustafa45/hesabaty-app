import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
    },
    content: {
      paddingHorizontal: theme.spacing.cardPadding,
      paddingBottom: 120,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 14,
      paddingBottom: 16,
    },
    iconBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBtnDisabled: {
      opacity: 0.3,
    },
    monthBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    dayGroup: {
      marginBottom: 4,
    },
    dayLabel: {
      marginTop: 14,
      marginBottom: 4,
    },
    dayCard: {
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
  });

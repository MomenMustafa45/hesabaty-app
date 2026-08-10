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
    title: {
      paddingTop: 14,
      paddingBottom: 16,
    },
    card: {
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      paddingHorizontal: theme.spacing.cardPadding,
      marginBottom: 16,
    },
    /** Matches the prototype's `.seg` width on Appearance/Language rows. */
    segmentWrap: {
      width: 132,
    },
    prototypeLabel: {
      marginTop: 4,
      marginBottom: 8,
      marginHorizontal: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
  });

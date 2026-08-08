import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.nile,
      borderRadius: theme.radii.radius,
      padding: 22,
      marginBottom: 14,
      overflow: 'hidden',
    },
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
    figures: {
      flex: 1,
      gap: 2,
    },
    big: {
      fontSize: 26,
      fontFamily: theme.fontFamilyByWeight[700],
      color: theme.ringColors.ringSafe,
    },
    cap: {
      fontSize: 12,
      fontFamily: theme.fontFamilyByWeight[400],
      color: theme.ringColors.ringSafe,
      opacity: 0.75,
    },
    legend: {
      flexDirection: 'row',
      gap: 14,
      marginTop: 14,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendText: {
      fontSize: 11,
      fontFamily: theme.fontFamilyByWeight[400],
      color: theme.ringColors.ringSafe,
      opacity: 0.85,
    },
    swatch: {
      width: 8,
      height: 8,
      borderRadius: 2,
    },
  });

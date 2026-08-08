import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 60,
      gap: 28,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    themeToggleButton: {
      paddingHorizontal: 14,
    },
    rtlNote: {
      backgroundColor: theme.colors.goldLight,
      borderWidth: 1,
      borderColor: theme.colors.gold,
      borderRadius: theme.radii.radiusSm,
      padding: 12,
    },
    section: {
      gap: 12,
    },
    sectionLabel: {
      marginBottom: 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
    },
    column: {
      gap: 10,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    iconGridItem: {
      width: 68,
      alignItems: 'center',
      gap: 6,
    },
    iconGridMark: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sheetContent: {
      gap: 16,
    },
  });

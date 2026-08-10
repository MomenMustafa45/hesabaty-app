import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.cardPadding,
    },
    contentContainer: {
      paddingBottom: 40,
    },
    section: {
      marginBottom: 22,
    },
    sectionTitle: {
      marginBottom: 8,
    },
    card: {
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.line,
    },
    rowLeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    swatch: {
      width: 10,
      height: 10,
      borderRadius: 3,
    },
    removeBtn: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.sand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 10,
    },
    addInput: {
      flex: 1,
      marginBottom: 0,
    },
    addButton: {
      paddingHorizontal: 18,
    },
  });

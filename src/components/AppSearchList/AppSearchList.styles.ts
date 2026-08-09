import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      flexShrink: 1,
    },
    searchInput: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.pill,
      paddingVertical: 11,
      paddingHorizontal: 16,
      fontFamily: theme.fontFamilyByWeight[400],
      fontSize: 14,
      marginBottom: 10,
      backgroundColor: theme.colors.sand2,
      color: theme.colors.ink,
    },
    sections: {
      gap: 4,
    },
    section: {
      marginBottom: 4,
    },
    sectionTitle: {
      marginTop: 12,
      marginBottom: 6,
      marginHorizontal: 2,
    },
    list: {
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radiusSm,
      overflow: 'hidden',
      backgroundColor: theme.colors.sand2,
    },
    listConstrained: {
      maxHeight: 340,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 13,
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.line,
      gap: 12,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowSelected: {
      backgroundColor: theme.colors.nileLight,
    },
    rowLeading: {
      flex: 1,
      gap: 2,
    },
    rowPressed: {
      backgroundColor: theme.colors.sand,
    },
  });

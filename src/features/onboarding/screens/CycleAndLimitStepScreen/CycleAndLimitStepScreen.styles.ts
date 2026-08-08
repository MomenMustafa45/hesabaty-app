import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
      paddingHorizontal: 24,
      paddingBottom: 32,
    },
    topBar: {
      position: 'relative',
      minHeight: 36,
      justifyContent: 'center',
      marginBottom: 22,
    },
    langSlot: {
      position: 'absolute',
      end: 0,
      top: 0,
      zIndex: 1,
    },
    content: {
      flex: 1,
      paddingTop: 12,
      gap: 10,
    },
    subtitle: {
      marginBottom: 6,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 4,
    },
    chipHint: {
      marginBottom: 8,
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 16,
    },
    backButton: {
      width: 'auto',
      paddingHorizontal: 20,
      flexGrow: 0,
    },
    continueButton: {
      flex: 1,
    },
  });

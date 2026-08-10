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
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 18,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryCard: {
      marginBottom: 20,
    },
    summaryLabel: {
      marginBottom: 4,
    },
    summaryAmount: {
      fontSize: 24,
      marginBottom: 4,
    },
    sectionTitle: {
      marginBottom: 10,
    },
    pendingCard: {
      paddingHorizontal: theme.spacing.cardPadding,
      paddingVertical: 4,
      marginBottom: 20,
    },
    pendingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.line,
    },
    pendingRowLast: {
      borderBottomWidth: 0,
    },
    catDot: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pendingMid: {
      flex: 1,
      gap: 2,
    },
    pendingActions: {
      flexDirection: 'row',
      gap: 6,
    },
    iconBtn: {
      width: 32,
      height: 32,
      borderRadius: theme.radii.radiusSm,
      borderWidth: 1,
      borderColor: theme.colors.line,
      backgroundColor: theme.colors.sand2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyPending: {
      paddingVertical: 26,
      alignItems: 'center',
    },
    continueButton: {
      marginTop: 4,
    },
  });

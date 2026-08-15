import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.sand,
    },
    content: {
      paddingHorizontal: theme.spacing.cardPadding,
      paddingBottom: verticalScale(40),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(12),
      marginBottom: verticalScale(18),
    },
    backBtn: {
      width: scale(36),
      height: scale(36),
      borderRadius: moderateScale(18),
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryCard: {
      marginBottom: verticalScale(20),
    },
    summaryLabel: {
      marginBottom: verticalScale(4),
    },
    summaryAmount: {
      fontSize: moderateScale(24),
      marginBottom: verticalScale(4),
    },
    sectionTitle: {
      marginBottom: verticalScale(10),
    },
    pendingCard: {
      paddingHorizontal: theme.spacing.cardPadding,
      paddingVertical: verticalScale(4),
      marginBottom: verticalScale(20),
    },
    pendingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(12),
      paddingVertical: verticalScale(12),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.line,
    },
    pendingRowLast: {
      borderBottomWidth: 0,
    },
    catDot: {
      width: scale(36),
      height: scale(36),
      borderRadius: moderateScale(18),
      alignItems: 'center',
      justifyContent: 'center',
    },
    pendingMid: {
      flex: 1,
      gap: moderateScale(2),
    },
    pendingActions: {
      flexDirection: 'row',
      gap: moderateScale(6),
    },
    iconBtn: {
      width: scale(32),
      height: scale(32),
      borderRadius: theme.radii.radiusSm,
      borderWidth: 1,
      borderColor: theme.colors.line,
      backgroundColor: theme.colors.sand2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyPending: {
      paddingVertical: verticalScale(26),
      alignItems: 'center',
    },
    continueButton: {
      marginTop: verticalScale(4),
    },
  });

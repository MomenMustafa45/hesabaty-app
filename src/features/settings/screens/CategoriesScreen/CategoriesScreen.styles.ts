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
      flex: 1,
      paddingHorizontal: theme.spacing.cardPadding,
    },
    contentContainer: {
      paddingBottom: verticalScale(40),
    },
    section: {
      marginBottom: verticalScale(22),
    },
    sectionTitle: {
      marginBottom: verticalScale(8),
    },
    card: {
      backgroundColor: theme.colors.sand2,
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radius,
      paddingHorizontal: scale(16),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: verticalScale(12),
    },
    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.line,
    },
    rowLeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(10),
    },
    swatch: {
      width: scale(10),
      height: scale(10),
      borderRadius: moderateScale(3),
    },
    removeBtn: {
      width: scale(24),
      height: scale(24),
      borderRadius: moderateScale(12),
      backgroundColor: theme.colors.sand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(8),
      marginTop: verticalScale(10),
    },
    addInput: {
      flex: 1,
      marginBottom: 0,
    },
    addButton: {
      paddingHorizontal: scale(18),
    },
  });

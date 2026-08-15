import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';
import { scale, verticalScale, moderateScale } from '@config/scaling';

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
      paddingVertical: verticalScale(11),
      paddingHorizontal: scale(16),
      fontFamily: theme.fontFamilyByWeight[400],
      fontSize: moderateScale(14),
      marginBottom: verticalScale(10),
      backgroundColor: theme.colors.sand2,
      color: theme.colors.ink,
    },
    sections: {
      gap: moderateScale(4),
    },
    section: {
      marginBottom: verticalScale(4),
    },
    sectionTitle: {
      marginTop: verticalScale(12),
      marginBottom: verticalScale(6),
      marginHorizontal: scale(2),
    },
    list: {
      borderWidth: 1,
      borderColor: theme.colors.line,
      borderRadius: theme.radii.radiusSm,
      overflow: 'hidden',
      backgroundColor: theme.colors.sand2,
    },
    listConstrained: {
      maxHeight: verticalScale(340),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: verticalScale(13),
      paddingHorizontal: scale(14),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.line,
      gap: moderateScale(12),
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowSelected: {
      backgroundColor: theme.colors.nileLight,
    },
    rowLeading: {
      flex: 1,
      gap: moderateScale(2),
    },
    rowLabelLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(8),
    },
    rowPressed: {
      backgroundColor: theme.colors.sand,
    },
  });

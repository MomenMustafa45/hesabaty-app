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
      gap: 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingBottom: 16,
    },
    greet: {
      gap: 2,
    },
    sectionHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 6,
      marginBottom: 10,
    },
    seeAll: {
      fontSize: 12.5,
      fontFamily: theme.fontFamilyByWeight[600],
      color: theme.colors.nile,
    },
    fab: {
      position: 'absolute',
      bottom: 92,
      // `end` flips with RTL (physical right in LTR, physical left in RTL).
      // Do not use left/right + I18nManager.isRTL — that combination stayed
      // stuck on the physical right during M5 RTL verification.
      end: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.gold,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.gold,
      shadowOpacity: 0.45,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
  });

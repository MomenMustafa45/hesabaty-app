import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      alignSelf: 'flex-start',
      paddingVertical: 2,
      paddingHorizontal: 7,
      borderRadius: theme.radii.pill,
    },
    label: {
      fontSize: 11,
      fontFamily: theme.fontFamilyByWeight[700],
    },
  });

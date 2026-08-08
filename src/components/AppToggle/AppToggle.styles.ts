import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    track: {
      width: 44,
      height: 26,
      borderRadius: theme.radii.pill,
      backgroundColor: theme.colors.line,
      justifyContent: 'center',
    },
    trackOn: {
      backgroundColor: theme.colors.nile,
    },
    knob: {
      position: 'absolute',
      top: 3,
      left: 3,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
  });

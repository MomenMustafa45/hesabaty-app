import { StyleSheet } from 'react-native';
import { Theme } from '@config/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.overlay,
    },
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight: '88%',
      backgroundColor: theme.colors.sand2,
      borderTopLeftRadius: theme.radii.sheetRadius,
      borderTopRightRadius: theme.radii.sheetRadius,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 4,
      backgroundColor: theme.colors.line,
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 4,
    },
    body: {
      paddingHorizontal: 20,
      paddingTop: 6,
      paddingBottom: 28,
    },
  });

import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AppCard.styles';

export interface AppCardProps extends ViewProps {
  children?: React.ReactNode;
}

export const AppCard: React.FC<AppCardProps> = ({ children, style, ...rest }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
};

export default AppCard;

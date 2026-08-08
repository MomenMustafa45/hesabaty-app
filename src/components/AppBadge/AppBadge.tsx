import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AppBadge.styles';

export type AppBadgeTone = 'gold' | 'coral' | 'nile';

export interface AppBadgeProps extends TextProps {
  tone: AppBadgeTone;
  children?: React.ReactNode;
}

const backgroundColorByTone = {
  gold: 'goldLight',
  coral: 'coralLight',
  nile: 'nileLight',
} as const;

const textColorByTone = {
  gold: 'goldText',
  coral: 'coral',
  nile: 'nile',
} as const;

export const AppBadge: React.FC<AppBadgeProps> = ({ tone, children, style, ...rest }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const backgroundColor = theme.colors[backgroundColorByTone[tone]];
  const textColor = theme.colors[textColorByTone[tone]];

  return (
    <Text style={[styles.badge, { backgroundColor, color: textColor }, styles.label, style]} {...rest}>
      {children}
    </Text>
  );
};

export default AppBadge;

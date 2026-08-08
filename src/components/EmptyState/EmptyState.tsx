import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@providers/ThemeProvider';
import AppIcon, { AppIconName } from '../AppIcon';
import AppText from '../AppText';
import { createStyles } from './EmptyState.styles';

export interface EmptyStateProps {
  icon: AppIconName;
  title: string;
  subtitle?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.mark}>
        <AppIcon name={icon} size={24} color={theme.colors.ink2} />
      </View>
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="muted" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
};

export default EmptyState;

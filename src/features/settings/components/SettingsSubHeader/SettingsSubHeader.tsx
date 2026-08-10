import React from 'react';
import { I18nManager, Pressable, View } from 'react-native';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './SettingsSubHeader.styles';

export interface SettingsSubHeaderProps {
  title: string;
  onBack: () => void;
}

export const SettingsSubHeader: React.FC<SettingsSubHeaderProps> = ({
  title,
  onBack,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const backIcon = I18nManager.isRTL ? 'chevronRight' : 'chevronLeft';

  return (
    <View style={styles.row}>
      <Pressable
        style={styles.backBtn}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back">
        <AppIcon name={backIcon} size={16} color={theme.colors.ink} />
      </Pressable>
      <AppText variant="h2">{title}</AppText>
    </View>
  );
};

export default SettingsSubHeader;

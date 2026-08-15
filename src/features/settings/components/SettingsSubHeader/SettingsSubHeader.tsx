import React from 'react';
import { I18nManager, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import { localizationKeys } from '@locales/localizationKeys';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './SettingsSubHeader.styles';
import { useSettingsStore } from '@store/settingsStore';

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
  const { t } = useTranslation();
  const { language } = useSettingsStore();
  const backIcon = language === 'ar' ? 'chevronRight' : 'chevronLeft';

  return (
    <View style={styles.row}>
      <Pressable
        style={styles.backBtn}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={t(localizationKeys.back)}
      >
        <AppIcon name={backIcon} size={16} color={theme.colors.ink} />
      </Pressable>
      <AppText variant="h2">{title}</AppText>
    </View>
  );
};

export default SettingsSubHeader;

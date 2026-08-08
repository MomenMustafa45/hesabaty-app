import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { localizationKeys } from '@locales/localizationKeys';
import { switchOnboardingLanguage } from '@locales/switchLanguage';
import { AppLanguage, OnboardingDraft } from '@models/settings';
import { useTheme } from '@providers/ThemeProvider';
import { useSettingsStore } from '@store/settingsStore';
import { createStyles } from './OnboardingLanguageSwitcher.styles';

interface OnboardingLanguageSwitcherProps {
  draft: OnboardingDraft;
}

export const OnboardingLanguageSwitcher: React.FC<
  OnboardingLanguageSwitcherProps
> = ({ draft }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const language = useSettingsStore(state => state.language);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSelect = (next: AppLanguage) => {
    if (isSwitching || next === language) {
      return;
    }
    setIsSwitching(true);
    void switchOnboardingLanguage(next, draft).finally(() => {
      setIsSwitching(false);
    });
  };

  return (
    <View style={styles.seg}>
      <Pressable
        style={[styles.option, language === 'en' ? styles.optionActive : null]}
        disabled={isSwitching}
        onPress={() => handleSelect('en')}>
        <Text
          style={[
            styles.optionText,
            language === 'en' ? styles.optionTextActive : null,
          ]}>
          {t(localizationKeys.langEn)}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.option, language === 'ar' ? styles.optionActive : null]}
        disabled={isSwitching}
        onPress={() => handleSelect('ar')}>
        <Text
          style={[
            styles.optionText,
            language === 'ar' ? styles.optionTextActive : null,
          ]}>
          {t(localizationKeys.langAr)}
        </Text>
      </Pressable>
    </View>
  );
};

export default OnboardingLanguageSwitcher;

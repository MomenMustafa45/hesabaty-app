import React, { useMemo } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import OnboardingLanguageSwitcher from '@features/onboarding/components/OnboardingLanguageSwitcher';
import OnboardingStepDots from '@features/onboarding/components/OnboardingStepDots';
import { localizationKeys } from '@locales/localizationKeys';
import { OnboardingStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import {
  createDefaultOnboardingDraft,
  useSettingsStore,
} from '@store/settingsStore';
import { createStyles } from './WelcomeScreen.styles';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const onboardingDraft = useSettingsStore(state => state.onboardingDraft);
  const setOnboardingDraft = useSettingsStore(state => state.setOnboardingDraft);

  const draft = useMemo(
    () => ({
      ...(onboardingDraft ?? createDefaultOnboardingDraft()),
      step: 'Welcome' as const,
    }),
    [onboardingDraft],
  );

  const handleGetStarted = () => {
    setOnboardingDraft({
      ...draft,
      step: 'CurrencyStep',
    });
    navigation.navigate('CurrencyStep');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <OnboardingStepDots step={1} />
        <View style={styles.langSlot}>
          <OnboardingLanguageSwitcher draft={draft} />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.mark}>
          <AppIcon name="wallet" size={34} color="#FFFFFF" />
        </View>
        <View style={styles.titleBlock}>
          <AppText variant="muted">{t(localizationKeys.welcome)}</AppText>
          <AppText variant="h1">{t(localizationKeys.appName)}</AppText>
        </View>
        <AppText variant="muted" style={styles.subtitle}>
          {t(localizationKeys.welcomeSub)}
        </AppText>
      </View>
      <AppButton variant="primary" onPress={handleGetStarted}>
        {t(localizationKeys.getStarted)}
      </AppButton>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import notifee from 'react-native-notify-kit';
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
import { createStyles } from './NotificationPermissionStepScreen.styles';

type Props = NativeStackScreenProps<
  OnboardingStackParamList,
  'NotificationPermissionStep'
>;

export const NotificationPermissionStepScreen: React.FC<Props> = ({
  route,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const onboardingDraft = useSettingsStore(state => state.onboardingDraft);
  const completeOnboarding = useSettingsStore(state => state.completeOnboarding);
  const [isRequesting, setIsRequesting] = useState(false);
  const { currency, monthlyLimit, cycleType, cycleStartDay } = route.params;

  const draft = useMemo(
    () => ({
      ...(onboardingDraft ?? createDefaultOnboardingDraft()),
      step: 'NotificationPermissionStep' as const,
      currency,
      cycleType,
      cycleStartDay,
      draftLimitMajor:
        onboardingDraft?.draftLimitMajor ??
        String(monthlyLimit / 100),
    }),
    [onboardingDraft, currency, cycleType, cycleStartDay, monthlyLimit],
  );

  const handleFinish = async (requestPermission: boolean) => {
    if (isRequesting) {
      return;
    }
    setIsRequesting(true);
    try {
      if (requestPermission) {
        await notifee.requestPermission();
      }
    } finally {
      completeOnboarding({
        currency,
        monthlyLimit,
        cycleType,
        cycleStartDay,
      });
      setIsRequesting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <OnboardingStepDots step={4} />
        <View style={styles.langSlot}>
          <OnboardingLanguageSwitcher draft={draft} />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.mark}>
          <AppIcon name="bell" size={32} color="#FFFFFF" />
        </View>
        <AppText variant="h2">{t(localizationKeys.notifTitle)}</AppText>
        <AppText variant="muted" style={styles.subtitle}>
          {t(localizationKeys.notifSub)}
        </AppText>
      </View>
      <View style={styles.actions}>
        <AppButton
          variant="primary"
          disabled={isRequesting}
          onPress={() => {
            void handleFinish(true);
          }}>
          {t(localizationKeys.enableReminders)}
        </AppButton>
        <AppButton
          variant="ghost"
          disabled={isRequesting}
          onPress={() => {
            void handleFinish(false);
          }}>
          {t(localizationKeys.skipForNow)}
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default NotificationPermissionStepScreen;

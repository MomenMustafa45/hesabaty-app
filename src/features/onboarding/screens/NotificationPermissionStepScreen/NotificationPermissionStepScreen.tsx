import React, { useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import notifee from 'react-native-notify-kit';
import AppButton from '@components/AppButton';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import OnboardingStepDots from '@features/onboarding/components/OnboardingStepDots';
import { OnboardingStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { useSettingsStore } from '@store/settingsStore';
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
  const completeOnboarding = useSettingsStore(state => state.completeOnboarding);
  const [isRequesting, setIsRequesting] = useState(false);
  const { currency, monthlyLimit, cycleType, cycleStartDay } = route.params;

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
      <OnboardingStepDots step={4} />
      <View style={styles.body}>
        <View style={styles.mark}>
          <AppIcon name="bell" size={32} color="#FFFFFF" />
        </View>
        <AppText variant="h2">Stay on track</AppText>
        <AppText variant="muted" style={styles.subtitle}>
          We can remind you if you go quiet, and warn you before you hit your
          limit. You can change this anytime in Settings.
        </AppText>
      </View>
      <View style={styles.actions}>
        <AppButton
          variant="primary"
          disabled={isRequesting}
          onPress={() => {
            void handleFinish(true);
          }}>
          Enable reminders
        </AppButton>
        <AppButton
          variant="ghost"
          disabled={isRequesting}
          onPress={() => {
            void handleFinish(false);
          }}>
          Skip for now
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default NotificationPermissionStepScreen;

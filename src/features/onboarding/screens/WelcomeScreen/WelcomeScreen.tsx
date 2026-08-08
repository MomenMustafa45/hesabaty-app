import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import OnboardingStepDots from '@features/onboarding/components/OnboardingStepDots';
import { useTheme } from '@providers/ThemeProvider';
import { OnboardingStackParamList } from '@navigations/types';
import { createStyles } from './WelcomeScreen.styles';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleGetStarted = () => {
    navigation.navigate('CurrencyStep');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <OnboardingStepDots step={1} />
      <View style={styles.body}>
        <View style={styles.mark}>
          <AppIcon name="wallet" size={34} color="#FFFFFF" />
        </View>
        <View style={styles.titleBlock}>
          <AppText variant="muted">Welcome to</AppText>
          <AppText variant="h1">حساباتي</AppText>
        </View>
        <AppText variant="muted" style={styles.subtitle}>
          Track what you spend, what you earn, and stay inside your monthly
          limit — all on your device.
        </AppText>
      </View>
      <AppButton variant="primary" onPress={handleGetStarted}>
        Get started
      </AppButton>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

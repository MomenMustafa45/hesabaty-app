import React, { useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppChip from '@components/AppChip';
import AppIcon from '@components/AppIcon';
import AppInput from '@components/AppInput';
import AppText from '@components/AppText';
import OnboardingStepDots from '@features/onboarding/components/OnboardingStepDots';
import { CycleType } from '@models/settings';
import { OnboardingStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './CycleAndLimitStepScreen.styles';

type Props = NativeStackScreenProps<
  OnboardingStackParamList,
  'CycleAndLimitStep'
>;

const majorUnitsToMinorUnits = (value: string): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.round(parsed * 100);
};

export const CycleAndLimitStepScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { currency } = route.params;
  const [cycleType, setCycleType] = useState<CycleType>('calendar');
  const [cycleStartDay, setCycleStartDay] = useState('1');
  const [draftLimit, setDraftLimit] = useState('6000');

  const cycleHint =
    cycleType === 'calendar'
      ? 'Resets on the 1st of every month'
      : 'Resets on a day you choose — e.g. salary day';

  const minorLimit = majorUnitsToMinorUnits(draftLimit);
  const canContinue = minorLimit !== null;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    if (minorLimit === null) {
      return;
    }
    const parsedStartDay = Math.max(
      1,
      Math.min(28, Number(cycleStartDay) || 1),
    );
    navigation.navigate('NotificationPermissionStep', {
      currency,
      monthlyLimit: minorLimit,
      cycleType,
      cycleStartDay: cycleType === 'custom' ? parsedStartDay : null,
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <OnboardingStepDots step={3} />
      <View style={styles.content}>
        <AppText variant="h2">Set your monthly limit</AppText>
        <AppText variant="muted" style={styles.subtitle}>
          Choose how your month is tracked and how much you want to spend.
        </AppText>

        <View style={styles.chipsRow}>
          <AppChip
            selected={cycleType === 'calendar'}
            onPress={() => setCycleType('calendar')}>
            Calendar month
          </AppChip>
          <AppChip
            selected={cycleType === 'custom'}
            onPress={() => setCycleType('custom')}>
            Custom cycle
          </AppChip>
        </View>
        <AppText variant="tiny" style={styles.chipHint}>
          {cycleHint}
        </AppText>

        {cycleType === 'custom' ? (
          <AppInput
            label="Cycle start day"
            type="number"
            value={cycleStartDay}
            onChangeText={setCycleStartDay}
            keyboardType="number-pad"
          />
        ) : null}

        <AppInput
          label={`Monthly spending limit (${currency})`}
          type="number"
          value={draftLimit}
          onChangeText={setDraftLimit}
          keyboardType="decimal-pad"
        />
      </View>
      <View style={styles.actions}>
        <AppButton
          variant="ghost"
          fullWidth={false}
          style={styles.backButton}
          onPress={handleBack}
          leadingIcon={<AppIcon name="chevronLeft" size={18} color={theme.colors.ink} />}>
          Back
        </AppButton>
        <AppButton
          variant="primary"
          style={styles.continueButton}
          disabled={!canContinue}
          onPress={handleContinue}>
          Continue
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default CycleAndLimitStepScreen;

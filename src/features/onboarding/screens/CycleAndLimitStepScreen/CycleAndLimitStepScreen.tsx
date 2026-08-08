import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppChip from '@components/AppChip';
import AppIcon from '@components/AppIcon';
import AppInput from '@components/AppInput';
import AppText from '@components/AppText';
import OnboardingLanguageSwitcher from '@features/onboarding/components/OnboardingLanguageSwitcher';
import OnboardingStepDots from '@features/onboarding/components/OnboardingStepDots';
import { localizationKeys } from '@locales/localizationKeys';
import { CycleType } from '@models/settings';
import { OnboardingStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import {
  createDefaultOnboardingDraft,
  useSettingsStore,
} from '@store/settingsStore';
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
  const { t } = useTranslation();
  const onboardingDraft = useSettingsStore(state => state.onboardingDraft);
  const setOnboardingDraft = useSettingsStore(state => state.setOnboardingDraft);
  const { currency } = route.params;
  const [cycleType, setCycleType] = useState<CycleType>(
    onboardingDraft?.cycleType ?? 'calendar',
  );
  const [cycleStartDay, setCycleStartDay] = useState(
    String(onboardingDraft?.cycleStartDay ?? 1),
  );
  const [draftLimit, setDraftLimit] = useState(
    onboardingDraft?.draftLimitMajor ?? '6000',
  );

  const parsedStartDay = Math.max(
    1,
    Math.min(28, Number(cycleStartDay) || 1),
  );

  const draft = useMemo(
    () => ({
      ...(onboardingDraft ?? createDefaultOnboardingDraft()),
      step: 'CycleAndLimitStep' as const,
      currency,
      cycleType,
      cycleStartDay: cycleType === 'custom' ? parsedStartDay : null,
      draftLimitMajor: draftLimit,
    }),
    [
      onboardingDraft,
      currency,
      cycleType,
      parsedStartDay,
      draftLimit,
    ],
  );

  const cycleHint =
    cycleType === 'calendar'
      ? t(localizationKeys.calendarMonthSub)
      : t(localizationKeys.customCycleSub);

  const minorLimit = majorUnitsToMinorUnits(draftLimit);
  const canContinue = minorLimit !== null;

  const persistDraft = (next: typeof draft) => {
    setOnboardingDraft(next);
  };

  const handleCycleTypeChange = (next: CycleType) => {
    setCycleType(next);
    persistDraft({
      ...draft,
      cycleType: next,
      cycleStartDay: next === 'custom' ? parsedStartDay : null,
    });
  };

  const handleStartDayChange = (value: string) => {
    setCycleStartDay(value);
    const day = Math.max(1, Math.min(28, Number(value) || 1));
    persistDraft({
      ...draft,
      cycleStartDay: cycleType === 'custom' ? day : null,
      draftLimitMajor: draftLimit,
    });
  };

  const handleLimitChange = (value: string) => {
    setDraftLimit(value);
    persistDraft({
      ...draft,
      draftLimitMajor: value,
    });
  };

  const handleBack = () => {
    setOnboardingDraft({
      ...draft,
      step: 'CurrencyStep',
    });
    navigation.goBack();
  };

  const handleContinue = () => {
    if (minorLimit === null) {
      return;
    }
    setOnboardingDraft({
      ...draft,
      step: 'NotificationPermissionStep',
    });
    navigation.navigate('NotificationPermissionStep', {
      currency,
      monthlyLimit: minorLimit,
      cycleType,
      cycleStartDay: cycleType === 'custom' ? parsedStartDay : null,
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <OnboardingStepDots step={3} />
        <View style={styles.langSlot}>
          <OnboardingLanguageSwitcher draft={draft} />
        </View>
      </View>
      <View style={styles.content}>
        <AppText variant="h2">{t(localizationKeys.cycleTitle)}</AppText>
        <AppText variant="muted" style={styles.subtitle}>
          {t(localizationKeys.cycleSub)}
        </AppText>

        <View style={styles.chipsRow}>
          <AppChip
            selected={cycleType === 'calendar'}
            onPress={() => handleCycleTypeChange('calendar')}>
            {t(localizationKeys.calendarMonth)}
          </AppChip>
          <AppChip
            selected={cycleType === 'custom'}
            onPress={() => handleCycleTypeChange('custom')}>
            {t(localizationKeys.customCycle)}
          </AppChip>
        </View>
        <AppText variant="tiny" style={styles.chipHint}>
          {cycleHint}
        </AppText>

        {cycleType === 'custom' ? (
          <AppInput
            label={t(localizationKeys.startDay)}
            type="number"
            value={cycleStartDay}
            onChangeText={handleStartDayChange}
            keyboardType="number-pad"
          />
        ) : null}

        <AppInput
          label={`${t(localizationKeys.monthlyLimit)} (${currency})`}
          type="number"
          value={draftLimit}
          onChangeText={handleLimitChange}
          keyboardType="decimal-pad"
        />
      </View>
      <View style={styles.actions}>
        <AppButton
          variant="ghost"
          fullWidth={false}
          style={styles.backButton}
          onPress={handleBack}
          leadingIcon={
            <AppIcon name="chevronLeft" size={18} color={theme.colors.ink} />
          }>
          {t(localizationKeys.back)}
        </AppButton>
        <AppButton
          variant="primary"
          style={styles.continueButton}
          disabled={!canContinue}
          onPress={handleContinue}>
          {t(localizationKeys.continueBtn)}
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default CycleAndLimitStepScreen;

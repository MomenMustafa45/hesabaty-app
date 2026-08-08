import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppIcon from '@components/AppIcon';
import AppSearchList from '@components/AppSearchList';
import AppText from '@components/AppText';
import { CURRENCIES, DEFAULT_CURRENCY_CODE } from '@config/currencies';
import OnboardingLanguageSwitcher from '@features/onboarding/components/OnboardingLanguageSwitcher';
import OnboardingStepDots from '@features/onboarding/components/OnboardingStepDots';
import { localizationKeys } from '@locales/localizationKeys';
import { OnboardingStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import {
  createDefaultOnboardingDraft,
  useSettingsStore,
} from '@store/settingsStore';
import { createStyles } from './CurrencyStepScreen.styles';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CurrencyStep'>;

export const CurrencyStepScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const onboardingDraft = useSettingsStore(state => state.onboardingDraft);
  const setOnboardingDraft = useSettingsStore(state => state.setOnboardingDraft);
  const [selectedId, setSelectedId] = useState(
    onboardingDraft?.currency ?? DEFAULT_CURRENCY_CODE,
  );

  const draft = useMemo(
    () => ({
      ...(onboardingDraft ?? createDefaultOnboardingDraft()),
      step: 'CurrencyStep' as const,
      currency: selectedId,
    }),
    [onboardingDraft, selectedId],
  );

  const items = useMemo(
    () =>
      CURRENCIES.map(currency => ({
        id: currency.code,
        label: currency.code,
        sublabel: currency.name,
        meta: currency.symbol,
      })),
    [],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setOnboardingDraft({
      ...(onboardingDraft ?? createDefaultOnboardingDraft()),
      step: 'CurrencyStep',
      currency: id,
    });
  };

  const handleBack = () => {
    setOnboardingDraft({
      ...draft,
      step: 'Welcome',
    });
    navigation.goBack();
  };

  const handleContinue = () => {
    setOnboardingDraft({
      ...draft,
      step: 'CycleAndLimitStep',
    });
    navigation.navigate('CycleAndLimitStep', { currency: selectedId });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <OnboardingStepDots step={2} />
        <View style={styles.langSlot}>
          <OnboardingLanguageSwitcher draft={draft} />
        </View>
      </View>
      <View style={styles.content}>
        <AppText variant="h2">{t(localizationKeys.currencyTitle)}</AppText>
        <AppText variant="muted" style={styles.subtitle}>
          {t(localizationKeys.currencySub)}
        </AppText>
        <AppSearchList
          items={items}
          selectedId={selectedId}
          onSelect={handleSelect}
          searchable
          searchPlaceholder={t(localizationKeys.searchCurrency)}
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
          onPress={handleContinue}>
          {t(localizationKeys.continueBtn)}
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default CurrencyStepScreen;

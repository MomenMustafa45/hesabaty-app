import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppIcon from '@components/AppIcon';
import AppSearchList from '@components/AppSearchList';
import AppText from '@components/AppText';
import { CURRENCIES, DEFAULT_CURRENCY_CODE } from '@config/currencies';
import OnboardingStepDots from '@features/onboarding/components/OnboardingStepDots';
import { OnboardingStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './CurrencyStepScreen.styles';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CurrencyStep'>;

export const CurrencyStepScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [selectedId, setSelectedId] = useState(DEFAULT_CURRENCY_CODE);

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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    navigation.navigate('CycleAndLimitStep', { currency: selectedId });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <OnboardingStepDots step={2} />
      <View style={styles.content}>
        <AppText variant="h2">Choose your currency</AppText>
        <AppText variant="muted" style={styles.subtitle}>
          This is how amounts will be shown across the app.
        </AppText>
        <AppSearchList
          items={items}
          selectedId={selectedId}
          onSelect={setSelectedId}
          searchable
          searchPlaceholder="Search currencies"
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
          onPress={handleContinue}>
          Continue
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default CurrencyStepScreen;

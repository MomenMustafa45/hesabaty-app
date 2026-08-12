import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppChip from '@components/AppChip';
import AppInput from '@components/AppInput';
import AppText from '@components/AppText';
import { SettingsSubHeader } from '@features/settings/components/SettingsSubHeader';
import { majorToMinor, minorToMajor } from '@lib/currencyUtils';
import { localizationKeys } from '@locales/localizationKeys';
import { CycleType } from '@models/settings';
import { SettingsStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { useSettingsStore } from '@store/settingsStore';
import { createStyles } from './CycleLimitScreen.styles';

type Navigation = NativeStackNavigationProp<SettingsStackParamList, 'CycleLimit'>;

export const CycleLimitScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();

  const currency = useSettingsStore(state => state.currency);
  const cycleType = useSettingsStore(state => state.cycleType);
  const cycleStartDay = useSettingsStore(state => state.cycleStartDay);
  const monthlyLimit = useSettingsStore(state => state.monthlyLimit);
  const setCycleType = useSettingsStore(state => state.setCycleType);
  const setCycleStartDay = useSettingsStore(state => state.setCycleStartDay);
  const setMonthlyLimit = useSettingsStore(state => state.setMonthlyLimit);

  const [draftCycleType, setDraftCycleType] = useState<CycleType>(
    cycleType ?? 'calendar',
  );
  const [startDayText, setStartDayText] = useState(String(cycleStartDay ?? 1));
  const [limitText, setLimitText] = useState(
    monthlyLimit != null ? String(minorToMajor(monthlyLimit)) : '',
  );

  const handleCycleTypeChange = (next: CycleType) => {
    setDraftCycleType(next);
  };

  const handleStartDayChange = (value: string) => {
    setStartDayText(value);
  };

  const handleLimitChange = (value: string) => {
    setLimitText(value);
  };

  const handleDone = () => {
    const minor = majorToMinor(Number(limitText) || 0);
    if (minor <= 0) {
      return;
    }
    setCycleType(draftCycleType);
    setCycleStartDay(
      draftCycleType === 'custom'
        ? Math.max(1, Math.min(28, Number(startDayText) || 1))
        : null,
    );
    setMonthlyLimit(minor);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <SettingsSubHeader
          title={t(localizationKeys.budgetCycle)}
          onBack={() => navigation.goBack()}
        />

        <View style={styles.chipsRow}>
          <AppChip
            selected={draftCycleType === 'calendar'}
            onPress={() => handleCycleTypeChange('calendar')}>
            {t(localizationKeys.calendarMonth)}
          </AppChip>
          <AppChip
            selected={draftCycleType === 'custom'}
            onPress={() => handleCycleTypeChange('custom')}>
            {t(localizationKeys.customCycle)}
          </AppChip>
        </View>
        <AppText variant="tiny" style={styles.chipHint}>
          {draftCycleType === 'calendar'
            ? t(localizationKeys.calendarMonthSub)
            : t(localizationKeys.customCycleSub)}
        </AppText>

        {draftCycleType === 'custom' ? (
          <AppInput
            label={t(localizationKeys.startDayShort)}
            type="number"
            value={startDayText}
            onChangeText={handleStartDayChange}
            keyboardType="number-pad"
            containerStyle={styles.field}
          />
        ) : null}

        <AppInput
          label={t(localizationKeys.monthlyLimitWithCurrency, {
            label: t(localizationKeys.monthlyLimit),
            currency: currency ?? '',
          })}
          type="number"
          value={limitText}
          onChangeText={handleLimitChange}
          keyboardType="decimal-pad"
          containerStyle={styles.field}
        />

        <AppButton
          variant="primary"
          style={styles.doneButton}
          disabled={!(Number(limitText) > 0)}
          onPress={handleDone}>
          {t(localizationKeys.done)}
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default CycleLimitScreen;

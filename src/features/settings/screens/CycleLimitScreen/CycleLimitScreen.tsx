import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppChip from '@components/AppChip';
import AppInput from '@components/AppInput';
import AppText from '@components/AppText';
import { SettingsSubHeader } from '@features/settings/components/SettingsSubHeader';
import { majorToMinor, minorToMajor } from '@lib/currencyUtils';
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
          title="Budget cycle & limit"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.chipsRow}>
          <AppChip
            selected={draftCycleType === 'calendar'}
            onPress={() => handleCycleTypeChange('calendar')}>
            Calendar month
          </AppChip>
          <AppChip
            selected={draftCycleType === 'custom'}
            onPress={() => handleCycleTypeChange('custom')}>
            Custom cycle
          </AppChip>
        </View>
        <AppText variant="tiny" style={styles.chipHint}>
          {draftCycleType === 'calendar'
            ? 'Tracks the 1st through the last day of each month.'
            : 'Tracks a repeating cycle starting on a day you choose.'}
        </AppText>

        {draftCycleType === 'custom' ? (
          <AppInput
            label="Start day"
            type="number"
            value={startDayText}
            onChangeText={handleStartDayChange}
            keyboardType="number-pad"
            containerStyle={styles.field}
          />
        ) : null}

        <AppInput
          label={`Monthly limit (${currency ?? ''})`}
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
          Done
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default CycleLimitScreen;

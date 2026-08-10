import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppCard from '@components/AppCard';
import AppSearchList from '@components/AppSearchList';
import AppText from '@components/AppText';
import { CURRENCIES } from '@config/currencies';
import { SettingsSubHeader } from '@features/settings/components/SettingsSubHeader';
import { SettingsStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { useSettingsStore } from '@store/settingsStore';
import { createStyles } from './CurrencyScreen.styles';

type Navigation = NativeStackNavigationProp<SettingsStackParamList, 'Currency'>;

export const CurrencyScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<Navigation>();
  const currency = useSettingsStore(state => state.currency);
  const setCurrency = useSettingsStore(state => state.setCurrency);
  const [pendingCode, setPendingCode] = useState<string | null>(null);

  const items = useMemo(
    () =>
      CURRENCIES.map(option => ({
        id: option.code,
        label: option.code,
        sublabel: option.name,
        meta: option.symbol,
      })),
    [],
  );

  const pendingOption = CURRENCIES.find(option => option.code === pendingCode);

  const handleSelect = (id: string) => {
    if (id === currency) {
      return;
    }
    setPendingCode(id);
  };

  const handleCancel = () => {
    setPendingCode(null);
  };

  const handleConfirm = () => {
    if (!pendingCode) {
      return;
    }
    setCurrency(pendingCode);
    setPendingCode(null);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <SettingsSubHeader
          title="Select currency"
          onBack={() => navigation.goBack()}
        />

        {pendingOption ? (
          <AppCard style={styles.warningCard}>
            <AppText variant="h3" color="ink" style={styles.warningTitle}>
              Change currency to {pendingOption.code}?
            </AppText>
            <AppText variant="tiny" color="ink" style={styles.warningBody}>
              There's no conversion — everything you've already logged will
              keep displaying with its original amounts, just shown with the{' '}
              {pendingOption.symbol} symbol from now on. Past totals may no
              longer make sense next to new ones.
            </AppText>
            <View style={styles.warningActions}>
              <AppButton
                variant="ghost"
                fullWidth={false}
                style={styles.warningButton}
                onPress={handleCancel}>
                Cancel
              </AppButton>
              <AppButton
                variant="primary"
                fullWidth={false}
                style={styles.warningButton}
                onPress={handleConfirm}>
                Change anyway
              </AppButton>
            </View>
          </AppCard>
        ) : null}

        <AppSearchList
          items={items}
          selectedId={currency}
          onSelect={handleSelect}
          searchable
          searchPlaceholder="Search currency"
        />
      </View>
    </SafeAreaView>
  );
};

export default CurrencyScreen;

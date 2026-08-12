import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppCard from '@components/AppCard';
import AppSearchList from '@components/AppSearchList';
import AppText from '@components/AppText';
import { CURRENCIES } from '@config/currencies';
import { SettingsSubHeader } from '@features/settings/components/SettingsSubHeader';
import { localizationKeys } from '@locales/localizationKeys';
import { SettingsStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { useSettingsStore } from '@store/settingsStore';
import { createStyles } from './CurrencyScreen.styles';

type Navigation = NativeStackNavigationProp<SettingsStackParamList, 'Currency'>;

export const CurrencyScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
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
          title={t(localizationKeys.selectCurrency)}
          onBack={() => navigation.goBack()}
        />

        {pendingOption ? (
          <AppCard style={styles.warningCard}>
            <AppText variant="h3" color="ink" style={styles.warningTitle}>
              {t(localizationKeys.currencyChangeTitle, {
                code: pendingOption.code,
              })}
            </AppText>
            <AppText variant="tiny" color="ink" style={styles.warningBody}>
              {t(localizationKeys.currencyChangeBody, {
                symbol: pendingOption.symbol,
              })}
            </AppText>
            <View style={styles.warningActions}>
              <AppButton
                variant="ghost"
                fullWidth={false}
                style={styles.warningButton}
                onPress={handleCancel}>
                {t(localizationKeys.cancel)}
              </AppButton>
              <AppButton
                variant="primary"
                fullWidth={false}
                style={styles.warningButton}
                onPress={handleConfirm}>
                {t(localizationKeys.changeAnyway)}
              </AppButton>
            </View>
          </AppCard>
        ) : null}

        <AppSearchList
          items={items}
          selectedId={currency}
          onSelect={handleSelect}
          searchable
          searchPlaceholder={t(localizationKeys.searchCurrency)}
        />
      </View>
    </SafeAreaView>
  );
};

export default CurrencyScreen;

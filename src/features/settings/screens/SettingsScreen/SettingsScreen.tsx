import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppSegmentedControl from '@components/AppSegmentedControl';
import AppText from '@components/AppText';
import { SettingsRow } from '@features/settings/components/SettingsRow';
import { useCurrency } from '@hooks/useCurrency';
import { scheduleDevTestNotification } from '@lib/notifications';
import { localizationKeys } from '@locales/localizationKeys';
import { switchAppLanguage } from '@locales/switchLanguage';
import { AppLanguage } from '@models/settings';
import { SettingsStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { useRolloverStore } from '@store/rolloverStore';
import { useSettingsStore } from '@store/settingsStore';
import { ThemeMode } from '@config/theme';
import { createStyles } from './SettingsScreen.styles';

type Navigation = NativeStackNavigationProp<SettingsStackParamList, 'SettingsHome'>;

export const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();

  const currency = useSettingsStore(state => state.currency);
  const monthlyLimit = useSettingsStore(state => state.monthlyLimit);
  const language = useSettingsStore(state => state.language);
  const setThemeOverride = useSettingsStore(state => state.setThemeOverride);
  const openManualPreview = useRolloverStore(state => state.openManualPreview);
  const { formatMoney } = useCurrency();

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeOverride(mode);
  };

  const handleLanguageChange = (next: AppLanguage) => {
    if (next === language) {
      return;
    }
    void switchAppLanguage(next);
  };

  const handleDevTestNotification = async () => {
    try {
      const fireAt = await scheduleDevTestNotification();
      Alert.alert(
        t(localizationKeys.devTestArmedTitle),
        t(localizationKeys.devTestArmedBody, {
          time: fireAt.toLocaleTimeString(),
        }),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t(localizationKeys.devTestFailedFallback);
      Alert.alert(t(localizationKeys.devTestFailedTitle), message);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        showsVerticalScrollIndicator={false}>
        <AppText variant="h1" style={styles.title}>
          {t(localizationKeys.settingsTitle)}
        </AppText>

        <View style={styles.card}>
          <SettingsRow
            icon={theme.mode === 'dark' ? 'moon' : 'sun'}
            label={t(localizationKeys.appearance)}
            trailing={
              <View style={styles.segmentWrap}>
                <AppSegmentedControl<ThemeMode>
                  options={[
                    { value: 'light', label: t(localizationKeys.light) },
                    { value: 'dark', label: t(localizationKeys.dark) },
                  ]}
                  value={theme.mode}
                  onChange={handleThemeChange}
                />
              </View>
            }
          />
          <SettingsRow
            icon="globe"
            label={t(localizationKeys.language)}
            trailing={
              <View style={styles.segmentWrap}>
                <AppSegmentedControl<AppLanguage>
                  options={[
                    { value: 'en', label: t(localizationKeys.langEn) },
                    { value: 'ar', label: t(localizationKeys.langAr) },
                  ]}
                  value={language}
                  onChange={handleLanguageChange}
                />
              </View>
            }
          />
          <SettingsRow
            icon="wallet"
            label={t(localizationKeys.currency)}
            meta={currency ?? ''}
            onPress={() => navigation.navigate('Currency')}
          />
          <SettingsRow
            icon="chart"
            label={t(localizationKeys.budgetCycle)}
            meta={monthlyLimit != null ? formatMoney(monthlyLimit) : ''}
            onPress={() => navigation.navigate('CycleLimit')}
          />
          <SettingsRow
            icon="tag"
            label={t(localizationKeys.categories)}
            onPress={() => navigation.navigate('Categories')}
          />
          <SettingsRow
            icon="bell"
            label={t(localizationKeys.notifications)}
            isLast
            onPress={() => navigation.navigate('NotificationSettings')}
          />
        </View>

        <View style={styles.card}>
          <SettingsRow
            icon="download"
            label={t(localizationKeys.exportRow)}
            onPress={() => navigation.navigate('ExportImport')}
          />
          <SettingsRow
            icon="info"
            label={t(localizationKeys.about)}
            isLast
            onPress={() => navigation.navigate('About')}
          />
        </View>

        {__DEV__ ? (
          <>
            <AppText variant="tiny" style={styles.prototypeLabel}>
              {t(localizationKeys.prototypeTools)}
            </AppText>
            <View style={styles.card}>
              <SettingsRow
                icon="bell"
                label={t(localizationKeys.previewRollover)}
                onPress={openManualPreview}
              />
              <SettingsRow
                icon="bell"
                label={t(localizationKeys.scheduleTestNotification)}
                isLast
                onPress={() => {
                  void handleDevTestNotification();
                }}
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

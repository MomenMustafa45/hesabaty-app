import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppSegmentedControl from '@components/AppSegmentedControl';
import AppText from '@components/AppText';
import { SettingsRow } from '@features/settings/components/SettingsRow';
import { useCurrency } from '@hooks/useCurrency';
import { scheduleDevTestNotification } from '@lib/notifications';
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
        'Dev test armed',
        `OS notification should fire around ${fireAt.toLocaleTimeString()}. Verify on a real device.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not schedule test';
      Alert.alert('Dev test failed', message);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        showsVerticalScrollIndicator={false}>
        <AppText variant="h1" style={styles.title}>
          Settings
        </AppText>

        <View style={styles.card}>
          <SettingsRow
            icon={theme.mode === 'dark' ? 'moon' : 'sun'}
            label="Appearance"
            trailing={
              <View style={styles.segmentWrap}>
                <AppSegmentedControl<ThemeMode>
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                  ]}
                  value={theme.mode}
                  onChange={handleThemeChange}
                />
              </View>
            }
          />
          <SettingsRow
            icon="globe"
            label="Language"
            trailing={
              <View style={styles.segmentWrap}>
                <AppSegmentedControl<AppLanguage>
                  options={[
                    { value: 'en', label: 'EN' },
                    { value: 'ar', label: 'AR' },
                  ]}
                  value={language}
                  onChange={handleLanguageChange}
                />
              </View>
            }
          />
          <SettingsRow
            icon="wallet"
            label="Currency"
            meta={currency ?? ''}
            onPress={() => navigation.navigate('Currency')}
          />
          <SettingsRow
            icon="chart"
            label="Budget cycle & limit"
            meta={monthlyLimit != null ? formatMoney(monthlyLimit) : ''}
            onPress={() => navigation.navigate('CycleLimit')}
          />
          <SettingsRow
            icon="tag"
            label="Categories"
            onPress={() => navigation.navigate('Categories')}
          />
          <SettingsRow
            icon="bell"
            label="Notifications"
            isLast
            onPress={() => navigation.navigate('NotificationSettings')}
          />
        </View>

        <View style={styles.card}>
          <SettingsRow
            icon="download"
            label="Export & Import"
            onPress={() => navigation.navigate('ExportImport')}
          />
          <SettingsRow
            icon="info"
            label="About"
            isLast
            onPress={() => navigation.navigate('About')}
          />
        </View>

        {__DEV__ ? (
          <>
            <AppText variant="tiny" style={styles.prototypeLabel}>
              Prototype preview
            </AppText>
            <View style={styles.card}>
              <SettingsRow
                icon="bell"
                label="Preview: new month rollover"
                onPress={openManualPreview}
              />
              <SettingsRow
                icon="bell"
                label="Schedule test notification (~90s)"
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

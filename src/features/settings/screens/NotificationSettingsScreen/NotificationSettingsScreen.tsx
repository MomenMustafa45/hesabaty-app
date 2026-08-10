import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppCard from '@components/AppCard';
import AppDate from '@components/AppDate';
import AppText from '@components/AppText';
import AppToggle from '@components/AppToggle';
import { SettingsSubHeader } from '@features/settings/components/SettingsSubHeader';
import { dateToTimeString, timeStringToDate } from '@lib/dateUtils';
import { SettingsStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { useSettingsStore } from '@store/settingsStore';
import { createStyles } from './NotificationSettingsScreen.styles';

type Navigation = NativeStackNavigationProp<
  SettingsStackParamList,
  'NotificationSettings'
>;

export const NotificationSettingsScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<Navigation>();

  const dailyReminderEnabled = useSettingsStore(state => state.dailyReminderEnabled);
  const dailyReminderTime = useSettingsStore(state => state.dailyReminderTime);
  const limitWarningsEnabled = useSettingsStore(state => state.limitWarningsEnabled);
  const monthlyReportEnabled = useSettingsStore(state => state.monthlyReportEnabled);
  const setDailyReminderEnabled = useSettingsStore(
    state => state.setDailyReminderEnabled,
  );
  const setDailyReminderTime = useSettingsStore(state => state.setDailyReminderTime);
  const setLimitWarningsEnabled = useSettingsStore(
    state => state.setLimitWarningsEnabled,
  );
  const setMonthlyReportEnabled = useSettingsStore(
    state => state.setMonthlyReportEnabled,
  );

  const handleTimeChange = (date: Date) => {
    setDailyReminderTime(dateToTimeString(date));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <SettingsSubHeader
          title="Notifications"
          onBack={() => navigation.goBack()}
        />

        <AppCard style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <AppText variant="body" weight={600}>
                Daily reminder
              </AppText>
              <AppText variant="tiny">
                A gentle nudge to log today's spending.
              </AppText>
            </View>
            <AppToggle
              value={dailyReminderEnabled}
              onValueChange={setDailyReminderEnabled}
              accessibilityLabel="Daily reminder"
            />
          </View>
          {dailyReminderEnabled ? (
            <View style={styles.timeRow}>
              <AppDate
                mode="time"
                label="Reminder time"
                value={timeStringToDate(dailyReminderTime)}
                onChange={handleTimeChange}
              />
            </View>
          ) : null}
        </AppCard>

        <AppCard style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <AppText variant="body" weight={600}>
                Limit warnings
              </AppText>
              <AppText variant="tiny">
                Get notified when you're close to your monthly limit.
              </AppText>
            </View>
            <AppToggle
              value={limitWarningsEnabled}
              onValueChange={setLimitWarningsEnabled}
              accessibilityLabel="Limit warnings"
            />
          </View>
        </AppCard>

        <AppCard style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <AppText variant="body" weight={600}>
                Monthly report
              </AppText>
              <AppText variant="tiny">
                A summary of your spending at the end of each cycle.
              </AppText>
            </View>
            <AppToggle
              value={monthlyReportEnabled}
              onValueChange={setMonthlyReportEnabled}
              accessibilityLabel="Monthly report"
            />
          </View>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationSettingsScreen;

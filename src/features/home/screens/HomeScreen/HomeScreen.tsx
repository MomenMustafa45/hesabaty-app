import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import EmptyState from '@components/EmptyState';
import { SpendRing } from '@features/home/components/SpendRing';
import { StatCards } from '@features/home/components/StatCards';
import { RecentTransactionsList } from '@features/home/components/RecentTransactionsList';
import { useCurrentCycleStats } from '@features/home/hooks/useCurrentCycleStats';
import { useTransactions } from '@features/transactions/hooks/useTransactions';
import { useCycleRange } from '@hooks/useCycleRange';
import { toIsoDate } from '@lib/dateUtils';
import { AppTabParamList } from '@navigations/types';
import { useSettingsStore } from '@store/settingsStore';
import { useTransactionSheetStore } from '@store/transactionSheetStore';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './HomeScreen.styles';

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const stats = useCurrentCycleStats();
  const monthlyLimit = useSettingsStore(state => state.monthlyLimit);
  const { start, end } = useCycleRange();
  const openAdd = useTransactionSheetStore(state => state.openAdd);
  const { data: cycleTransactions = [] } = useTransactions({
    dateFrom: toIsoDate(start),
    dateTo: toIsoDate(end),
  });

  const monthTitle = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    [],
  );

  const handleSeeAll = () => {
    navigation.navigate('History');
  };

  const hasTransactions = cycleTransactions.length > 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 4 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.greet}>
            <AppText variant="tiny">Welcome back</AppText>
            <AppText variant="h1">{monthTitle}</AppText>
          </View>
        </View>

        <SpendRing
          totalSpend={stats.totalSpend}
          monthlyLimit={monthlyLimit}
          limitPct={stats.limitPct}
          cyclePct={stats.cyclePct}
        />

        <StatCards totalIncome={stats.totalIncome} net={stats.net} />

        <View style={styles.sectionHead}>
          <AppText variant="h3">Recent</AppText>
          <Pressable onPress={handleSeeAll} hitSlop={8}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {hasTransactions ? (
          <RecentTransactionsList transactions={cycleTransactions} />
        ) : (
          <EmptyState
            icon="wallet"
            title="Nothing logged yet"
            subtitle="Tap the + button to add your first transaction."
          />
        )}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={openAdd}
        accessibilityRole="button"
        accessibilityLabel="Add transaction">
        <AppIcon name="plus" size={24} color={theme.ringColors.ringSafe} />
      </Pressable>
    </View>
  );
};

export default HomeScreen;

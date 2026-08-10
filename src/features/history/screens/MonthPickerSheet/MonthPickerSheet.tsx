import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import AppIcon from '@components/AppIcon';
import AppSearchList, {
  AppSearchListSection,
} from '@components/AppSearchList';
import AppText from '@components/AppText';
import BottomSheet from '@components/BottomSheet';
import { useBestMonth } from '@features/insights/hooks/useBestMonth';
import { useTransactions } from '@features/transactions/hooks/useTransactions';
import { useCurrency } from '@hooks/useCurrency';
import { formatMonthName, toYearMonthKey } from '@lib/dateUtils';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './MonthPickerSheet.styles';

export interface MonthPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  months: string[];
  selectedMonthKey: string;
  onSelectMonth: (monthKey: string) => void;
}

export const MonthPickerSheet: React.FC<MonthPickerSheetProps> = ({
  visible,
  onClose,
  months,
  selectedMonthKey,
  onSelectMonth,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { formatMoney } = useCurrency();
  const { data: transactions = [] } = useTransactions();
  const { bestKey } = useBestMonth();
  const currentMonthKey = toYearMonthKey(new Date());

  const spendByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const transaction of transactions) {
      if (transaction.type !== 'expense') {
        continue;
      }
      const key = transaction.date.slice(0, 7);
      map.set(key, (map.get(key) ?? 0) + transaction.amount);
    }
    return map;
  }, [transactions]);

  const sections = useMemo((): AppSearchListSection[] => {
    const byYear = new Map<string, string[]>();
    for (const monthKey of months) {
      const year = monthKey.slice(0, 4);
      const existing = byYear.get(year);
      if (existing) {
        existing.push(monthKey);
      } else {
        byYear.set(year, [monthKey]);
      }
    }

    const years = Array.from(byYear.keys()).sort().reverse();
    return years.map(year => {
      const yearMonths = (byYear.get(year) ?? []).slice().reverse();
      return {
        title: year,
        items: yearMonths.map(monthKey => ({
          id: monthKey,
          label: formatMonthName(monthKey),
          meta: formatMoney(spendByMonth.get(monthKey) ?? 0),
          badgeLabel: monthKey === bestKey ? '★ Best' : undefined,
        })),
      };
    });
  }, [months, spendByMonth, formatMoney, bestKey]);

  const handleSelect = (monthKey: string) => {
    onSelectMonth(monthKey);
    onClose();
  };

  const handleJumpToCurrent = () => {
    handleSelect(currentMonthKey);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.head}>
        <View style={styles.headSpacer} />
        <AppText variant="h3">Select a month</AppText>
        <Pressable
          style={styles.closeBtn}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close">
          <AppIcon name="x" size={15} color={theme.colors.ink} />
        </Pressable>
      </View>

      <Pressable
        style={styles.jumpRow}
        onPress={handleJumpToCurrent}
        accessibilityRole="button"
        accessibilityLabel="Jump to current month">
        <AppText weight={600} color="nile">
          Jump to current month
        </AppText>
        <AppIcon name="chevronForward" size={15} color={theme.colors.nile} />
      </Pressable>

      <AppSearchList
        sections={sections}
        selectedId={selectedMonthKey}
        onSelect={handleSelect}
        searchable={false}
      />
    </BottomSheet>
  );
};

export default MonthPickerSheet;

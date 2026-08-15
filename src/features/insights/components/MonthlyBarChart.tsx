import React, { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView, View } from 'react-native';
import AppText from '@components/AppText';
import { scale, verticalScale, moderateScale } from '@config/scaling';
import { formatMonthShort, localeForLanguage } from '@lib/dateUtils';
import { MonthStat } from '@features/insights/hooks/useMonthlyStats';
import { useSettingsStore } from '@store/settingsStore';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './MonthlyBarChart.styles';

export interface MonthlyBarChartProps {
  stats: MonthStat[];
  currentMonthKey: string;
  bestMonthKey: string | null;
}

const MAX_BAR_HEIGHT = verticalScale(96);
const MIN_BAR_HEIGHT = verticalScale(6);
const VISIBLE_MONTHS = 6;
const COLUMN_GAP = moderateScale(8);
const FALLBACK_COLUMN_WIDTH = scale(50);

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({
  stats,
  currentMonthKey,
  bestMonthKey,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const language = useSettingsStore(state => state.language);
  const locale = localeForLanguage(language);
  const scrollRef = useRef<ScrollView>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const maxSpend = Math.max(1, ...stats.map(stat => stat.totalSpend));

  const columnWidth =
    viewportWidth > 0
      ? (viewportWidth - COLUMN_GAP * (VISIBLE_MONTHS - 1)) / VISIBLE_MONTHS
      : FALLBACK_COLUMN_WIDTH;

  // Bars always read oldest-to-newest, left to right — standard time-series
  // convention. Without this, RTL's automatic row-mirroring would put the
  // current month on the left, which reads backwards for a chart.
  const orderedStats = language === 'ar' ? [...stats].reverse() : stats;

  useEffect(() => {
    if (viewportWidth === 0) {
      return;
    }
    // Scroll offset is always measured from the physical left edge of the
    // content regardless of RTL, and the current month is always rendered
    // at the physical right edge (see orderedStats above), so this
    // consistently reveals the current month by default.
    scrollRef.current?.scrollToEnd({ animated: false });
  }, [viewportWidth, stats.length]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setViewportWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.card}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onLayout={handleLayout}
        contentContainerStyle={styles.row}
      >
        {orderedStats.map(stat => {
          const isCurrent = stat.key === currentMonthKey;
          const isBest = stat.key === bestMonthKey;
          const barColor = isBest
            ? theme.colors.gold
            : isCurrent
            ? theme.colors.nile
            : theme.colors.line;
          const barHeight = Math.max(
            MIN_BAR_HEIGHT,
            Math.round((stat.totalSpend / maxSpend) * MAX_BAR_HEIGHT),
          );

          return (
            <View
              key={stat.key}
              style={[styles.column, { width: columnWidth }]}
            >
              <View
                style={[
                  styles.bar,
                  { height: barHeight, backgroundColor: barColor },
                ]}
              />
              <AppText
                variant="tiny"
                weight={isCurrent ? 700 : 400}
                style={styles.monthLabel}
              >
                {formatMonthShort(stat.key, locale)}
              </AppText>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MonthlyBarChart;

import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import AppText from '@components/AppText';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './CategoryDonut.styles';

export interface CategoryDonutSegment {
  id: string;
  label: string;
  color: string;
  amount: number;
  pct: number;
}

export interface CategoryDonutProps {
  segments: CategoryDonutSegment[];
}

const R = 46;
const C = 2 * Math.PI * R;
const SIZE = 120;
const CENTER = SIZE / 2;

export const CategoryDonut: React.FC<CategoryDonutProps> = ({ segments }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  let cumulativeOffset = 0;

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {segments.length === 0 ? (
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={R}
              stroke={theme.colors.line}
              strokeWidth={16}
              fill="none"
            />
          ) : (
            segments.map(segment => {
              const rotation = cumulativeOffset * 360 - 90;
              cumulativeOffset += segment.pct;
              return (
                <Circle
                  key={segment.id}
                  cx={CENTER}
                  cy={CENTER}
                  r={R}
                  stroke={segment.color}
                  strokeWidth={16}
                  fill="none"
                  strokeDasharray={`${C} ${C}`}
                  strokeDashoffset={C * (1 - segment.pct)}
                  transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
                />
              );
            })
          )}
        </Svg>

        <View style={styles.legend}>
          {segments.length === 0 ? (
            <AppText variant="tiny">—</AppText>
          ) : (
            segments.slice(0, 5).map(segment => (
              <View key={segment.id} style={styles.legendRow}>
                <View style={styles.legendLeading}>
                  <View
                    style={[styles.swatch, { backgroundColor: segment.color }]}
                  />
                  <AppText variant="tiny" color="ink">
                    {segment.label}
                  </AppText>
                </View>
                <AppText variant="tiny" weight={600} color="ink">
                  {`${Math.round(segment.pct * 100)}%`}
                </AppText>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
};

export default CategoryDonut;

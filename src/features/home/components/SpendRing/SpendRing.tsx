import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import AppText from '@components/AppText';
import { useCurrency } from '@hooks/useCurrency';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './SpendRing.styles';

export interface SpendRingProps {
  totalSpend: number;
  monthlyLimit: number | null;
  limitPct: number;
  cyclePct: number;
}

const R1 = 48;
const R2 = 38;
const C1 = 2 * Math.PI * R1;
const C2 = 2 * Math.PI * R2;

function spendRingColor(
  limitPct: number,
  ringColors: { ringSafe: string; ringWarn: string; ringDanger: string },
): string {
  if (limitPct >= 1) {
    return ringColors.ringDanger;
  }
  if (limitPct >= 0.8) {
    return ringColors.ringWarn;
  }
  return ringColors.ringSafe;
}

export const SpendRing: React.FC<SpendRingProps> = ({
  totalSpend,
  monthlyLimit,
  limitPct,
  cyclePct,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { formatMoney } = useCurrency();
  const stroke = spendRingColor(limitPct, theme.ringColors);
  const pctLabel = Math.round(limitPct * 100);
  const cycleLabel = Math.round(cyclePct * 100);
  const limitMinor = monthlyLimit ?? 0;

  return (
    <View style={styles.card}>
      <View style={styles.wrap}>
        <Svg width={112} height={112} viewBox="0 0 112 112">
          <Circle
            cx={56}
            cy={56}
            r={R1}
            stroke="rgba(255,255,255,.2)"
            strokeWidth={7}
            fill="none"
          />
          <Circle
            cx={56}
            cy={56}
            r={R1}
            stroke={stroke}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${C1} ${C1}`}
            strokeDashoffset={C1 * (1 - limitPct)}
            transform="rotate(-90 56 56)"
          />
          <Circle
            cx={56}
            cy={56}
            r={R2}
            stroke="rgba(255,255,255,.15)"
            strokeWidth={4}
            fill="none"
          />
          <Circle
            cx={56}
            cy={56}
            r={R2}
            stroke={theme.colors.gold}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${C2} ${C2}`}
            strokeDashoffset={C2 * (1 - cyclePct)}
            transform="rotate(-90 56 56)"
          />
          <SvgText
            x={56}
            y={52}
            textAnchor="middle"
            fill={theme.ringColors.ringSafe}
            fontSize={18}
            fontWeight="700"
            fontFamily={theme.fontFamilyByWeight[700]}
          >
            {`${pctLabel}%`}
          </SvgText>
          <SvgText
            x={56}
            y={68}
            textAnchor="middle"
            fill="rgba(255,255,255,.7)"
            fontSize={9}
            fontFamily={theme.fontFamilyByWeight[400]}
          >
            of your limit
          </SvgText>
        </Svg>
        <View style={styles.figures}>
          <Text style={styles.big}>{formatMoney(totalSpend)}</Text>
          <Text style={styles.cap}>
            spent · {formatMoney(limitMinor)} of your limit
          </Text>
        </View>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: stroke }]} />
          <AppText style={styles.legendText}>spent</AppText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.swatch, { backgroundColor: theme.colors.gold }]}
          />
          <AppText style={styles.legendText}>
            {cycleLabel}% of cycle elapsed
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default SpendRing;

import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AppIcon.styles';

export type AppIconName =
  | 'home'
  | 'history'
  | 'chart'
  | 'gear'
  | 'plus'
  | 'x'
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronForward'
  | 'chevronDown'
  | 'chevDown'
  | 'chevUp'
  | 'bell'
  | 'wallet'
  | 'globe'
  | 'info'
  | 'tag'
  | 'sun'
  | 'moon'
  | 'edit'
  | 'check'
  | 'download'
  | 'upload';

export interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
}

const renderChevronDown = (color: string): React.ReactNode => (
  <Path
    d="M6 9l6 6 6-6"
    stroke={color}
    strokeWidth={1.8}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const iconRenderers: Record<AppIconName, (color: string) => React.ReactNode> = {
  home: color => (
    <>
      <Path
        d="M4 11.5 12 5l8 6.5"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 10v8.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  history: color => (
    <Path d="M4 6h16M4 12h16M4 18h10" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" />
  ),
  chart: color => (
    <Path
      d="M5 19V10M11 19V5M17 19v-7"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  gear: color => (
    <>
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.7} fill="none" />
      <Path
        d="M12 3v2.2M12 18.8V21M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M3 12h2.2M18.8 12H21M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </>
  ),
  plus: color => <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.2} strokeLinecap="round" />,
  x: color => <Path d="M6 6l12 12M18 6 6 18" stroke={color} strokeWidth={2} strokeLinecap="round" />,
  chevronLeft: color => (
    <Path
      d="M15 5 8 12l7 7"
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  chevronRight: color => (
    <Path
      d="M9 5l7 7-7 7"
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  chevronForward: color => (
    <Path
      d="M9 6l6 6-6 6"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  chevronDown: renderChevronDown,
  /** Architecture §7 / §10.3 — same glyph as `chevronDown`. */
  chevDown: renderChevronDown,
  chevUp: color => (
    <Path
      d="M6 15l6-6 6 6"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  bell: color => (
    <>
      <Path
        d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z"
        stroke={color}
        strokeWidth={1.7}
        fill="none"
        strokeLinejoin="round"
      />
      <Path d="M9.5 17a2.5 2.5 0 0 0 5 0" stroke={color} strokeWidth={1.7} fill="none" />
    </>
  ),
  wallet: color => (
    <>
      <Rect x={3.5} y={6.5} width={17} height={12} rx={2.5} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M16 12.5h2.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M3.5 9.5h17" stroke={color} strokeWidth={1.7} />
    </>
  ),
  globe: color => (
    <>
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={1.7} fill="none" />
      <Path
        d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17"
        stroke={color}
        strokeWidth={1.7}
        fill="none"
      />
    </>
  ),
  info: color => (
    <>
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M12 11v5.5M12 8v.01" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </>
  ),
  tag: color => (
    <>
      <Path
        d="M12.5 4H6a1.5 1.5 0 0 0-1.5 1.5V12l9 9 8-8-9-9Z"
        stroke={color}
        strokeWidth={1.7}
        fill="none"
        strokeLinejoin="round"
      />
      <Circle cx={8.3} cy={8.3} r={1.3} fill={color} />
    </>
  ),
  sun: color => (
    <>
      <Circle cx={12} cy={12} r={4.2} stroke={color} strokeWidth={1.7} fill="none" />
      <Path
        d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </>
  ),
  moon: color => (
    <Path
      d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"
      stroke={color}
      strokeWidth={1.7}
      fill="none"
      strokeLinejoin="round"
    />
  ),
  edit: color => (
    <Path
      d="M4 20l1-4L16 5l3 3L8 19l-4 1Z"
      stroke={color}
      strokeWidth={1.6}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
  check: color => (
    <Path
      d="M5 13l4 4L19 7"
      stroke={color}
      strokeWidth={2.1}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  download: color => (
    <>
      <Path
        d="M12 4v11M7 11l5 5 5-5"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M4 19h16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </>
  ),
  upload: color => (
    <>
      <Path
        d="M12 20V9M7 13l5-5 5 5"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M4 19h16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </>
  ),
};

export const AppIcon: React.FC<AppIconProps> = ({ name, size = 20, color }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const resolvedColor = color ?? theme.colors.ink;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={styles.base}>
      {iconRenderers[name](resolvedColor)}
    </Svg>
  );
};

export default AppIcon;

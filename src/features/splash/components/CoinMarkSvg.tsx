import React from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

const CoinMarkSvg: React.FC = () => (
  <Svg width="100%" height="100%" viewBox="0 0 1024 1024">
    <Defs>
      <LinearGradient id="rim-a2" x1="15%" y1="0%" x2="85%" y2="100%">
        <Stop offset="0" stopColor="#F6E2A6" />
        <Stop offset="0.35" stopColor="#C89B3C" />
        <Stop offset="0.7" stopColor="#8B6520" />
        <Stop offset="1" stopColor="#E0BE72" />
      </LinearGradient>
      <LinearGradient id="face-a2" x1="25%" y1="5%" x2="75%" y2="100%">
        <Stop offset="0" stopColor="#17957A" />
        <Stop offset="1" stopColor="#064A3C" />
      </LinearGradient>
    </Defs>
    <Circle cx={512} cy={512} r={512} fill="url(#rim-a2)" />
    <Circle cx={512} cy={512} r={444} fill="url(#face-a2)" />
    <Circle
      cx={512}
      cy={512}
      r={444}
      fill="none"
      stroke="#02241D"
      strokeOpacity={0.35}
      strokeWidth={24}
    />
    <Circle
      cx={512}
      cy={512}
      r={286}
      fill="none"
      stroke="#FFFFFF"
      strokeOpacity={0.18}
      strokeWidth={30}
    />
    <Path
      d="M 512 226 A 286 286 0 0 1 735 683"
      fill="none"
      stroke="url(#rim-a2)"
      strokeWidth={30}
      strokeLinecap="round"
    />
    <Path
      d="M 190 300 A 440 440 0 0 1 640 120"
      fill="none"
      stroke="#FFFFFF"
      strokeOpacity={0.4}
      strokeWidth={12}
      strokeLinecap="round"
    />
  </Svg>
);

export default React.memo(CoinMarkSvg);

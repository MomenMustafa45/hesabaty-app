import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export interface SplashRadialBackgroundProps {
  width: number;
  height: number;
}

const SplashRadialBackgroundComponent: React.FC<SplashRadialBackgroundProps> = ({
  width,
  height,
}) => (
  <Svg
    width={width}
    height={height}
    style={styles.fill}
    pointerEvents="none">
    <Defs>
      <RadialGradient
        id="splashBg"
        cx="50%"
        cy="34%"
        rx="110%"
        ry="80%"
        gradientUnits="objectBoundingBox">
        <Stop offset="0" stopColor="#0E7861" />
        <Stop offset="0.46" stopColor="#085647" />
        <Stop offset="1" stopColor="#04332A" />
      </RadialGradient>
    </Defs>
    <Rect x={0} y={0} width={width} height={height} fill="url(#splashBg)" />
  </Svg>
);

const styles = StyleSheet.create({
  fill: StyleSheet.absoluteFill,
});

export const SplashRadialBackground = React.memo(SplashRadialBackgroundComponent);

export default SplashRadialBackground;

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { scale as scaleSize, verticalScale, moderateScale } from '@config/scaling';
import CoinMarkSvg from './CoinMarkSvg';

const HERO = moderateScale(220);
const COIN = moderateScale(182);
const SHINE_WIDTH = scaleSize(74);
const SHINE_HEIGHT = verticalScale(320);

export interface MintStrikeHeroProps {
  progress: SharedValue<number>;
}

export const MintStrikeHero: React.FC<MintStrikeHeroProps> = ({ progress }) => {
  const shockStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.29, 0.37, 0.7, 1],
      [0, 0, 0.75, 0, 0],
    );
    const scale = interpolate(
      progress.value,
      [0, 0.29, 0.37, 0.7, 1],
      [0.45, 0.45, 1, 2, 2],
    );
    return { opacity, transform: [{ scale }] };
  });

  const flashStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.27, 0.33, 0.56, 1],
      [0, 0, 0.95, 0, 0],
    );
    const scale = interpolate(
      progress.value,
      [0, 0.27, 0.33, 0.56, 1],
      [0.35, 0.35, 1, 1.8, 1.8],
    );
    return { opacity, transform: [{ scale }] };
  });

  const coinStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      progress.value,
      [0, 0.3, 0.4, 0.52, 1],
      [-150, 0, 0, 0, 0],
    );
    const scale = interpolate(
      progress.value,
      [0, 0.3, 0.4, 0.52, 1],
      [0.58, 1.08, 0.96, 1, 1],
    );
    const opacity = interpolate(progress.value, [0, 0.3, 1], [0, 1, 1]);
    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  const shineStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 0.52, 0.63, 0.82, 1],
      [-200, -200, 0, 200, 200],
    );
    const opacity = interpolate(
      progress.value,
      [0, 0.52, 0.63, 0.82, 1],
      [0, 0, 0.8, 0, 0],
    );
    return {
      opacity,
      transform: [{ translateX }, { rotate: '18deg' }],
    };
  });

  return (
    <View style={styles.hero}>
      <Animated.View style={[styles.shockRing, shockStyle]} />
      <Animated.View style={[styles.flash, flashStyle]} />
      <Animated.View style={[styles.coin, coinStyle]}>
        <CoinMarkSvg />
        <Animated.View style={[styles.shine, shineStyle]}>
          <View style={styles.shineBand} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    width: HERO,
    height: HERO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shockRing: {
    position: 'absolute',
    width: HERO,
    height: HERO,
    borderRadius: HERO / 2,
    borderWidth: 2,
    borderColor: '#C89B3C',
  },
  flash: {
    position: 'absolute',
    width: HERO,
    height: HERO,
    borderRadius: HERO / 2,
    backgroundColor: 'rgba(246,226,166,0.75)',
  },
  coin: {
    width: COIN,
    height: COIN,
    borderRadius: COIN / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(20) },
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(46),
    elevation: 12,
  },
  shine: {
    position: 'absolute',
    top: verticalScale(-50),
    left: 0,
    width: SHINE_WIDTH,
    height: SHINE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shineBand: {
    width: scaleSize(28),
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: moderateScale(4),
  },
});

export default MintStrikeHero;

/**
 * Responsive scaling helpers for layout dimensions.
 * Re-exports react-native-size-matters with project-local guidance:
 *
 * - scale() — horizontal sizes (width, paddingHorizontal, margins on X)
 * - verticalScale() — vertical sizes (height, paddingVertical, margins on Y)
 * - moderateScale() — typography, radii, icons, gaps (tempered scaling)
 * - moderateVerticalScale() — line heights and vertical metrics tied to type
 */
export {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  ScaledSheet,
} from 'react-native-size-matters';

import React, { useEffect, useState } from 'react';
import { Dimensions, LayoutChangeEvent, Modal, Pressable, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './BottomSheet.styles';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DISMISS_THRESHOLD = 100;

export const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, children }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isMounted, setIsMounted] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);
  const sheetHeight = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      progress.value = withTiming(1, { duration: 300 });
      return;
    }
    progress.value = withTiming(0, { duration: 250 }, finished => {
      if (finished) {
        runOnJS(setIsMounted)(false);
      }
    });
  }, [visible, progress]);

  const panGesture = Gesture.Pan()
    .activeOffsetY(4)
    .onUpdate(event => {
      if (event.translationY <= 0 || sheetHeight.value === 0) {
        return;
      }
      progress.value = Math.min(1, Math.max(0, 1 - event.translationY / sheetHeight.value));
    })
    .onEnd(event => {
      if (event.translationY > DISMISS_THRESHOLD) {
        runOnJS(onClose)();
        return;
      }
      progress.value = withSpring(1);
    });

  const handleLayout = (event: LayoutChangeEvent) => {
    sheetHeight.value = event.nativeEvent.layout.height;
  };

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * sheetHeight.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <Modal visible={isMounted} transparent animationType="none" onRequestClose={onClose}>
      {/* Modal renders in a separate native window/surface — gesture-handler
          only intercepts touches within a GestureHandlerRootView on that
          surface, so it needs its own nested root here, not just the one at
          the app root. */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Pressable style={{ flex: 1 }} onPress={onClose}>
          <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
        </Pressable>
        <Animated.View style={[styles.sheet, sheetAnimatedStyle]} onLayout={handleLayout}>
          <GestureDetector gesture={panGesture}>
            <View style={styles.handle} />
          </GestureDetector>
          <View style={styles.body}>{children}</View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default BottomSheet;

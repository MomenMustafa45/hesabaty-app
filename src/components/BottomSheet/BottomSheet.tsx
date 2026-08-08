import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  Modal,
  PanResponder,
  Pressable,
  View,
} from 'react-native';
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
  const [sheetHeight, setSheetHeight] = useState(SCREEN_HEIGHT);
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.timing(progress, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      return;
    }
    Animated.timing(progress, { toValue: 0, duration: 250, useNativeDriver: true }).start(result => {
      if (result.finished) {
        setIsMounted(false);
      }
    });
  }, [visible, progress]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 4,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy <= 0 || sheetHeight === 0) {
            return;
          }
          const nextProgress = Math.min(1, Math.max(0, 1 - gesture.dy / sheetHeight));
          progress.setValue(nextProgress);
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > DISMISS_THRESHOLD) {
            onClose();
            return;
          }
          Animated.spring(progress, { toValue: 1, useNativeDriver: true }).start();
        },
      }),
    [onClose, progress, sheetHeight],
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    setSheetHeight(event.nativeEvent.layout.height);
  };

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [sheetHeight, 0] });

  return (
    <Modal visible={isMounted} transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <Pressable style={{ flex: 1 }} onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: progress }]} />
        </Pressable>
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          onLayout={handleLayout}>
          <View {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>
          <View style={styles.body}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomSheet;

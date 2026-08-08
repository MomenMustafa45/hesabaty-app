import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './OnboardingStepDots.styles';

export interface OnboardingStepDotsProps {
  step: number;
  total?: number;
}

export const OnboardingStepDots: React.FC<OnboardingStepDotsProps> = ({
  step,
  total = 4,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, index) => {
        const isActive = index + 1 === step;
        return (
          <View
            key={index}
            style={[styles.dot, isActive && styles.dotActive]}
          />
        );
      })}
    </View>
  );
};

export default OnboardingStepDots;

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@components/AppText';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './InsightsScreen.styles';

export const InsightsScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.screen}>
      <AppText variant="h1">Insights</AppText>
    </SafeAreaView>
  );
};

export default InsightsScreen;

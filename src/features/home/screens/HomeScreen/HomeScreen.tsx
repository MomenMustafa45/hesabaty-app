import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppText from '@components/AppText';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './HomeScreen.styles';

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  const handleOpenAddTransaction = () => {
    navigation.navigate('AddTransactionSheet');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <AppText variant="h1">Home</AppText>
      {/* TODO(M2 verify): temporary button to test the known Android bug
          (tab content blanking after navigating outside the tab navigator
          and back). Remove once M5 builds the real Home screen — by then
          AddTransactionSheet will have its own real entry point (FAB). */}
      <AppButton
        variant="ghost"
        style={styles.testButton}
        onPress={handleOpenAddTransaction}>
        Open Add Transaction (test)
      </AppButton>
    </SafeAreaView>
  );
};

export default HomeScreen;

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppText from '@components/AppText';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AddTransactionSheet.styles';

export const AddTransactionSheet: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <AppText variant="h1">Add Transaction</AppText>
      <AppText variant="muted">
        Placeholder — this screen lives outside the tab navigator on purpose,
        to test the known Android tab-blanking bug (Section 1's risk note).
      </AppText>
      <AppButton style={styles.closeButton} onPress={handleClose}>
        Close
      </AppButton>
    </SafeAreaView>
  );
};

export default AddTransactionSheet;

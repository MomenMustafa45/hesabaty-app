import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@components/AppText';
import { SettingsSubHeader } from '@features/settings/components/SettingsSubHeader';
import { SettingsStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AboutScreen.styles';

type Navigation = NativeStackNavigationProp<SettingsStackParamList, 'About'>;

export const AboutScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<Navigation>();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <SettingsSubHeader title="About" onBack={() => navigation.goBack()} />
        <AppText variant="body" style={styles.body}>
          Your data is stored only on this device. Nothing is uploaded, and no
          account is required.
        </AppText>
      </View>
    </SafeAreaView>
  );
};

export default AboutScreen;

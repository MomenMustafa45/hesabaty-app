import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import { SettingsSubHeader } from '@features/settings/components/SettingsSubHeader';
import { SettingsStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './ExportImportScreen.styles';

type Navigation = NativeStackNavigationProp<SettingsStackParamList, 'ExportImport'>;

export const ExportImportScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<Navigation>();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <SettingsSubHeader
          title="Export & Import"
          onBack={() => navigation.goBack()}
        />
        <AppText variant="h3" style={styles.sectionTitle}>
          Export your data
        </AppText>
        <AppText variant="body" style={styles.body}>
          Save a copy of everything you've logged. Nothing uploads
          automatically — pick a backup file to keep everything safe, or a
          spreadsheet if you just want to browse your spending in Excel or
          Sheets.
        </AppText>
        <AppButton
          variant="ghost"
          disabled
          style={styles.actionButton}
          leadingIcon={
            <AppIcon name="download" size={16} color={theme.colors.ink3} />
          }>
          Backup file (JSON)
        </AppButton>
        <AppButton
          variant="ghost"
          disabled
          leadingIcon={
            <AppIcon name="download" size={16} color={theme.colors.ink3} />
          }>
          Spreadsheet (CSV)
        </AppButton>

        <AppText variant="h3" style={styles.sectionTitle}>
          Import
        </AppText>
        <AppText variant="body" style={styles.body}>
          Bring your data back from a backup file — you'll see a preview
          before anything is applied.
        </AppText>
        <AppButton
          variant="ghost"
          disabled
          leadingIcon={
            <AppIcon name="upload" size={16} color={theme.colors.ink3} />
          }>
          Choose a file
        </AppButton>

        <AppText variant="tiny" color="ink2" style={styles.comingSoon}>
          Coming in a future update.
        </AppText>
      </View>
    </SafeAreaView>
  );
};

export default ExportImportScreen;

import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import { SettingsSubHeader } from '@features/settings/components/SettingsSubHeader';
import { localizationKeys } from '@locales/localizationKeys';
import { SettingsStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './ExportImportScreen.styles';

type Navigation = NativeStackNavigationProp<SettingsStackParamList, 'ExportImport'>;

export const ExportImportScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <SettingsSubHeader
          title={t(localizationKeys.exportRow)}
          onBack={() => navigation.goBack()}
        />
        <AppText variant="h3" style={styles.sectionTitle}>
          {t(localizationKeys.exportTitle)}
        </AppText>
        <AppText variant="body" style={styles.body}>
          {t(localizationKeys.exportBody)}
        </AppText>
        <AppButton
          variant="ghost"
          disabled
          style={styles.actionButton}
          leadingIcon={
            <AppIcon name="download" size={16} color={theme.colors.ink3} />
          }>
          {t(localizationKeys.exportJson)}
        </AppButton>
        <AppButton
          variant="ghost"
          disabled
          leadingIcon={
            <AppIcon name="download" size={16} color={theme.colors.ink3} />
          }>
          {t(localizationKeys.exportCsv)}
        </AppButton>

        <AppText variant="h3" style={styles.sectionTitle}>
          {t(localizationKeys.importTitle)}
        </AppText>
        <AppText variant="body" style={styles.body}>
          {t(localizationKeys.importSectionBody)}
        </AppText>
        <AppButton
          variant="ghost"
          disabled
          leadingIcon={
            <AppIcon name="upload" size={16} color={theme.colors.ink3} />
          }>
          {t(localizationKeys.chooseFile)}
        </AppButton>

        <AppText variant="tiny" color="ink2" style={styles.comingSoon}>
          {t(localizationKeys.comingSoon)}
        </AppText>
      </View>
    </SafeAreaView>
  );
};

export default ExportImportScreen;

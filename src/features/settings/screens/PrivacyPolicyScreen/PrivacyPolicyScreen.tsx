import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppCard from '@components/AppCard';
import AppText from '@components/AppText';
import { SettingsSubHeader } from '@features/settings/components/SettingsSubHeader';
import { localizationKeys, LocalizationKey } from '@locales/localizationKeys';
import { SettingsStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './PrivacyPolicyScreen.styles';

type Navigation = NativeStackNavigationProp<
  SettingsStackParamList,
  'PrivacyPolicy'
>;

type PolicySection = {
  titleKey: LocalizationKey;
  bodyKey: LocalizationKey;
};

const SECTIONS: PolicySection[] = [
  {
    titleKey: localizationKeys.privacyWhatWeCollectTitle,
    bodyKey: localizationKeys.privacyWhatWeCollectBody,
  },
  {
    titleKey: localizationKeys.privacyCrashReportsTitle,
    bodyKey: localizationKeys.privacyCrashReportsBody,
  },
  {
    titleKey: localizationKeys.privacyNotificationsTitle,
    bodyKey: localizationKeys.privacyNotificationsBody,
  },
  {
    titleKey: localizationKeys.privacyPaymentsTitle,
    bodyKey: localizationKeys.privacyPaymentsBody,
  },
  {
    titleKey: localizationKeys.privacyDataDeletionTitle,
    bodyKey: localizationKeys.privacyDataDeletionBody,
  },
  {
    titleKey: localizationKeys.privacyPolicyChangesTitle,
    bodyKey: localizationKeys.privacyPolicyChangesBody,
  },
  {
    titleKey: localizationKeys.privacyContactTitle,
    bodyKey: localizationKeys.privacyContactBody,
  },
];

export const PrivacyPolicyScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();

  return (
    <View style={styles.content}>
      <SettingsSubHeader
        title={t(localizationKeys.privacyPolicy)}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <AppCard style={styles.card}>
          <AppText variant="h3">
            {t(localizationKeys.privacyPolicyTitle)}
          </AppText>
          <AppText variant="muted" style={[styles.body, styles.lastUpdated]}>
            {t(localizationKeys.privacyPolicyLastUpdated)}
          </AppText>
          <AppText variant="body" style={styles.body}>
            {t(localizationKeys.privacyPolicyIntro)}
          </AppText>
        </AppCard>

        {SECTIONS.map(section => (
          <AppCard key={section.titleKey} style={styles.card}>
            <AppText variant="h3" style={styles.sectionTitle}>
              {t(section.titleKey)}
            </AppText>
            <AppText variant="body" style={styles.body}>
              {t(section.bodyKey)}
            </AppText>
          </AppCard>
        ))}
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

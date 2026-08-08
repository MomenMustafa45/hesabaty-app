import RNRestart from 'react-native-restart';
import { AppLanguage, OnboardingDraft } from '@models/settings';
import { useSettingsStore } from '@store/settingsStore';
import i18n, { applyRtlForLanguage } from './i18n';

export async function switchOnboardingLanguage(
  next: AppLanguage,
  draft: OnboardingDraft,
): Promise<void> {
  const { language, setLanguage, setOnboardingDraft } =
    useSettingsStore.getState();

  setOnboardingDraft(draft);

  if (language === next && i18n.language === next) {
    return;
  }

  setLanguage(next);
  await i18n.changeLanguage(next);
  applyRtlForLanguage(next);
  RNRestart.restart();
}

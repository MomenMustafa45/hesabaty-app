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

/**
 * Main-app language switch (Settings, §13.3) — no draft to persist, and no
 * resume mechanism: losing "which tab you were on" is an accepted, minor
 * cost here, unlike onboarding where losing entered data would be a real
 * regression. Restarting naturally lands back on the tab navigator's first
 * tab (Home).
 */
export async function switchAppLanguage(next: AppLanguage): Promise<void> {
  const { language, setLanguage } = useSettingsStore.getState();

  if (language === next && i18n.language === next) {
    return;
  }

  setLanguage(next);
  await i18n.changeLanguage(next);
  applyRtlForLanguage(next);
  RNRestart.restart();
}

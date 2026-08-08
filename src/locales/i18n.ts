import { I18nManager } from 'react-native';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { AppLanguage } from '@models/settings';
import { storageKeys } from '@storage/keys';
import { mmkv } from '@storage/mmkv';
import ar from './ar.json';
import en from './en.json';

export type { AppLanguage };

function readPersistedLanguage(): AppLanguage | null {
  const raw = mmkv.getString(storageKeys.settings);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as {
      state?: { language?: string };
    };
    const language = parsed.state?.language;
    if (language === 'en' || language === 'ar') {
      return language;
    }
  } catch {
    return null;
  }
  return null;
}

function resolveDeviceLanguage(): AppLanguage {
  const locales = RNLocalize.getLocales();
  const primary = locales[0]?.languageCode;
  return primary === 'ar' ? 'ar' : 'en';
}

export function applyRtlForLanguage(language: AppLanguage): void {
  const isRtl = language === 'ar';
  I18nManager.allowRTL(isRtl);
  I18nManager.forceRTL(isRtl);
}

const bootstrapLanguage = readPersistedLanguage() ?? resolveDeviceLanguage();

export function getBootstrapLanguage(): AppLanguage {
  return bootstrapLanguage;
}

applyRtlForLanguage(bootstrapLanguage);

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: bootstrapLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

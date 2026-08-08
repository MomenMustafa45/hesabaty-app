export const localizationKeys = {
  appName: 'appName',
  welcome: 'welcome',
  welcomeSub: 'welcomeSub',
  getStarted: 'getStarted',
  currencyTitle: 'currencyTitle',
  currencySub: 'currencySub',
  searchCurrency: 'searchCurrency',
  continueBtn: 'continueBtn',
  back: 'back',
  cycleTitle: 'cycleTitle',
  cycleSub: 'cycleSub',
  calendarMonth: 'calendarMonth',
  calendarMonthSub: 'calendarMonthSub',
  customCycle: 'customCycle',
  customCycleSub: 'customCycleSub',
  startDay: 'startDay',
  monthlyLimit: 'monthlyLimit',
  notifTitle: 'notifTitle',
  notifSub: 'notifSub',
  enableReminders: 'enableReminders',
  skipForNow: 'skipForNow',
  langEn: 'langEn',
  langAr: 'langAr',
} as const;

export type LocalizationKey =
  (typeof localizationKeys)[keyof typeof localizationKeys];

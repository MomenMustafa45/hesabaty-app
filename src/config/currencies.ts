export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

/** Exact list from architecture §8.2; display names from the prototype. */
export const CURRENCIES: CurrencyOption[] = [
  { code: 'EGP', name: 'Egyptian pound', symbol: 'ج.م' },
  { code: 'USD', name: 'US dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British pound', symbol: '£' },
  { code: 'SAR', name: 'Saudi riyal', symbol: 'ر.س' },
  { code: 'AED', name: 'UAE dirham', symbol: 'د.إ' },
  { code: 'KWD', name: 'Kuwaiti dinar', symbol: 'د.ك' },
  { code: 'QAR', name: 'Qatari riyal', symbol: 'ر.ق' },
  { code: 'JOD', name: 'Jordanian dinar', symbol: 'د.أ' },
  { code: 'CAD', name: 'Canadian dollar', symbol: '$' },
  { code: 'AUD', name: 'Australian dollar', symbol: '$' },
  { code: 'TRY', name: 'Turkish lira', symbol: '₺' },
  { code: 'INR', name: 'Indian rupee', symbol: '₹' },
  { code: 'JPY', name: 'Japanese yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese yuan', symbol: '¥' },
  { code: 'CHF', name: 'Swiss franc', symbol: 'Fr' },
  { code: 'MAD', name: 'Moroccan dirham', symbol: 'د.م' },
  { code: 'TND', name: 'Tunisian dinar', symbol: 'د.ت' },
];

export const DEFAULT_CURRENCY_CODE = 'EGP';

import { CURRENCIES, DEFAULT_CURRENCY_CODE } from '@config/currencies';

export function getCurrencySymbol(currencyCode: string): string {
  const match = CURRENCIES.find(currency => currency.code === currencyCode);
  return match?.symbol ?? CURRENCIES[0].symbol;
}

/** Major units → integer minor units (piastres). */
export function majorToMinor(majorUnits: number): number {
  return Math.round(majorUnits * 100);
}

/** Integer minor units → major units (may be fractional before display rounding). */
export function minorToMajor(minorUnits: number): number {
  return minorUnits / 100;
}

/**
 * Display money from integer minor units — whole numbers only, matching
 * the prototype's `fmt()` (`Math.round(n).toLocaleString() + ' ' + symbol`).
 */
export function formatMoney(minorUnits: number, currencyCode: string): string {
  const symbol = getCurrencySymbol(currencyCode || DEFAULT_CURRENCY_CODE);
  const major = Math.round(minorToMajor(minorUnits));
  return `${major.toLocaleString('en')} ${symbol}`;
}

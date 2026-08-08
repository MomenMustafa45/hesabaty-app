import { useCallback, useMemo } from 'react';
import { DEFAULT_CURRENCY_CODE } from '@config/currencies';
import { formatMoney } from '@lib/currencyUtils';
import { useSettingsStore } from '@store/settingsStore';

export function useCurrency() {
  const currency = useSettingsStore(state => state.currency);
  const currencyCode = currency ?? DEFAULT_CURRENCY_CODE;

  const format = useCallback(
    (minorUnits: number) => formatMoney(minorUnits, currencyCode),
    [currencyCode],
  );

  return useMemo(
    () => ({
      currencyCode,
      formatMoney: format,
    }),
    [currencyCode, format],
  );
}

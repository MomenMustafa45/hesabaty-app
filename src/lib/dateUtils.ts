/** Local calendar date as `YYYY-MM-DD` (no UTC shift). */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Parse `YYYY-MM-DD` into a local midnight Date. */
export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function startOfLocalDay(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Local calendar month as `YYYY-MM` (prototype `ymKey`). */
export function toYearMonthKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/** Inclusive ISO date bounds for a calendar `YYYY-MM` month. */
export function monthDateRange(monthKey: string): {
  dateFrom: string;
  dateTo: string;
} {
  const [year, month] = monthKey.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return { dateFrom: toIsoDate(start), dateTo: toIsoDate(end) };
}

/** Full month label, e.g. "March 2026". */
export function formatMonthLabel(monthKey: string, locale = 'en-US'): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
}

/** Month-only label for pickers, e.g. "March". */
export function formatMonthName(monthKey: string, locale = 'en-US'): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(locale, {
    month: 'long',
  });
}

/** Abbreviated month label for chart axes, e.g. "Mar". */
export function formatMonthShort(monthKey: string, locale = 'en-US'): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(locale, {
    month: 'short',
  });
}

export const storageKeys = {
  settings: 'settings',
  /** Highest limit-warning tier already fired for a cycle (`{ cycleKey, tier }`). */
  limitWarningState: 'notifications.limitWarningState',
  /** Cycle key for which monthly-report notification already fired. */
  monthlyReportNotifiedCycleKey: 'notifications.monthlyReportNotifiedCycleKey',
} as const;

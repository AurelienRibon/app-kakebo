const PERIODICITIES = ['one-time', 'monthly'] as const;
const DEFAULT_PERIODICITY = 'one-time';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export type ExpensePeriodicity = typeof PERIODICITIES[number];

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export function getExpenseDefaultPeriodicity(): ExpensePeriodicity {
  return DEFAULT_PERIODICITY;
}

export function isPeriodicityValid(value: unknown): value is ExpensePeriodicity {
  return typeof value === 'string' && (PERIODICITIES as readonly string[]).includes(value);
}

const KINDS = ['essential', 'interesting', 'extra'] as const;
const DEFAULT_KIND = 'interesting';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export type ExpenseKind = typeof KINDS[number];

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export function getExpenseDefaultKind(): ExpenseKind {
  return DEFAULT_KIND;
}

export function isExpenseKindValid(value: unknown): value is ExpenseKind {
  return typeof value === 'string' && (KINDS as readonly string[]).includes(value);
}

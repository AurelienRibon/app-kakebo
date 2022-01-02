const KINDS = ['essential', 'interesting', 'extra'] as const;

export type ExpenseKind = typeof KINDS[number];

export function isExpenseKindValid(value: unknown): value is ExpenseKind {
  return typeof value === 'string' && (KINDS as readonly string[]).includes(value);
}

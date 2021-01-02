import expenseTypeDefs from '../meta/expense-types.json';

const DEFAULT_TYPE = lookupDefaultType();

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export type ExpenseTypeDef = { name: string; icon: string; default?: boolean };

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export function getExpenseTypeDefs(): ExpenseTypeDef[] {
  return expenseTypeDefs;
}

export function getExpenseDefaultCategory(): string {
  return 'unknown';
}

export function getExpenseDefaultType(): string {
  return DEFAULT_TYPE;
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function lookupDefaultType(): string {
  for (const def of expenseTypeDefs) {
    if (def.default) {
      return def.name;
    }
  }

  throw new Error(`No expense type was set as default.`);
}

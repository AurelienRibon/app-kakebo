import { formatDateToDay } from '../lib/dates';
import { guid } from '../lib/utils';
import expenseTypeDefs from '../meta/expense-types.json';

type ExpenseTypeDef = { name: string; icon: string; default?: boolean };

const DEFAULT_TYPE = lookupDefaultType();

export class Expense {
  public readonly id: string;
  public readonly date: Date;
  public readonly amount: number;
  public readonly category: string;
  public readonly type: string;
  public readonly label: string;
  public readonly comment: string;

  constructor(date = new Date(), amount = 0, category = 'unknown', type = DEFAULT_TYPE, label = '', comment = '') {
    this.id = guid();
    this.date = date;
    this.amount = amount;
    this.category = category;
    this.type = type;
    this.label = label;
    this.comment = comment;
  }

  serialize(): Record<string, unknown> {
    return {
      date: formatDateToDay(this.date),
      amount: this.amount,
      category: this.category,
      type: this.type,
      label: this.label,
      comment: this.comment,
    };
  }
}

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

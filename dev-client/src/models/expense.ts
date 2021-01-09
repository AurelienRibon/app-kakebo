import { getCategoryDef } from '../lib/categories';
import { formatDateToDay } from '../lib/dates';
import { ExpensePeriodicity, getExpenseDefaultPeriodicity } from '../lib/expenses-periodicities';
import { getExpenseDefaultType } from '../lib/expenses-types';
import { guid } from '../lib/utils';

const DEFAULT_TYPE = getExpenseDefaultType();
const DEFAULT_PERIODICITY = getExpenseDefaultPeriodicity();

export interface ExpenseSpec {
  id?: string;
  date?: Date;
  amount?: number;
  category?: string;
  type?: string;
  label?: string;
  periodicity?: ExpensePeriodicity;
}

export class Expense {
  public readonly id: string;
  public readonly date: Date;
  public readonly amount: number;
  public readonly category: string;
  public readonly type: string;
  public readonly label: string;
  public readonly periodicity: ExpensePeriodicity;

  constructor(spec: ExpenseSpec = {}) {
    this.id = spec.id || guid();
    this.date = spec.date || new Date();
    this.amount = spec.amount || 0;
    this.category = spec.category || 'unknown';
    this.type = spec.type || DEFAULT_TYPE;
    this.label = spec.label || '';
    this.periodicity = spec.periodicity || DEFAULT_PERIODICITY;
  }

  isExtra(): boolean {
    return getCategoryDef(this.category).extra === true;
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  getSign(): string {
    return this.isPositive() ? '+' : '-';
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      date: formatDateToDay(this.date),
      amount: this.amount,
      category: this.category,
      type: this.type,
      label: this.label,
      periodicity: this.periodicity,
    };
  }
}

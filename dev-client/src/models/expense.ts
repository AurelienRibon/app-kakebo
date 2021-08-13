import { getCategoryDef } from '../lib/categories';
import { formatDateToDay } from '../lib/dates';
import { ExpensePeriodicity, getExpenseDefaultPeriodicity } from '../lib/expense-periodicities';
import { guid } from '../lib/utils';

const DEFAULT_PERIODICITY = getExpenseDefaultPeriodicity();

export interface ExpenseSpec {
  _id?: string;
  date?: Date;
  amount?: number;
  category?: string;
  label?: string;
  periodicity?: ExpensePeriodicity;
  deleted?: boolean;
  checked?: boolean;
  updatedAt?: Date;
}

export class Expense {
  private _id: string;
  private _date: Date;
  private _amount: number;
  private _category: string;
  private _label: string;
  private _periodicity: ExpensePeriodicity;
  private _deleted: boolean;
  private _checked: boolean;
  private _updatedAt: Date;

  constructor(spec: ExpenseSpec = {}) {
    this._id = spec._id || guid();
    this._date = spec.date || new Date();
    this._amount = spec.amount || 0;
    this._category = spec.category || 'unknown';
    this._label = spec.label || '';
    this._periodicity = spec.periodicity || DEFAULT_PERIODICITY;
    this._deleted = spec.deleted || false;
    this._checked = spec.checked || false;
    this._updatedAt = spec.updatedAt || new Date();
  }

  get id(): string {
    return this._id;
  }

  get date(): Date {
    return this._date;
  }

  get amount(): number {
    return this._amount;
  }

  get category(): string {
    return this._category;
  }

  get label(): string {
    return this._label;
  }

  get periodicity(): ExpensePeriodicity {
    return this._periodicity;
  }

  get deleted(): boolean {
    return this._deleted;
  }

  get checked(): boolean {
    return this._checked;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isExtra(): boolean {
    return getCategoryDef(this.category).extra === true;
  }

  isRecurring(): boolean {
    return this.periodicity !== 'one-time';
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  getSign(): string {
    return this.isPositive() ? '+' : '-';
  }

  edit(changes: ExpenseSpec): void {
    for (const [key, value] of Object.entries(changes)) {
      switch (key) {
        case 'date':
          this._date = value;
          break;
        case 'amount':
          this._amount = value;
          break;
        case 'category':
          this._category = value;
          break;
        case 'label':
          this._label = value;
          break;
        case 'periodicity':
          this._periodicity = value;
          break;
        case 'deleted':
          this._deleted = value;
          break;
        case 'checked':
          this._checked = value;
          break;
      }

      this._updatedAt = new Date();
    }
  }

  serialize(): Record<string, unknown> {
    return {
      _id: this._id,
      date: formatDateToDay(this.date),
      amount: this.amount,
      category: this.category,
      label: this.label,
      periodicity: this.periodicity,
      deleted: this.deleted,
      checked: this.checked,
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

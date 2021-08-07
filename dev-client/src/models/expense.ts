import { getCategoryDef } from '../lib/categories';
import { formatDateToDay } from '../lib/dates';
import { ExpensePeriodicity, getExpenseDefaultPeriodicity } from '../lib/expenses-periodicities';
import { getExpenseDefaultType } from '../lib/expenses-types';
import { guid } from '../lib/utils';

const DEFAULT_TYPE = getExpenseDefaultType();
const DEFAULT_PERIODICITY = getExpenseDefaultPeriodicity();

export interface ExpenseSpec {
  _id?: string;
  date?: Date;
  amount?: number;
  category?: string;
  type?: string;
  label?: string;
  periodicity?: ExpensePeriodicity;
  deleted?: boolean;
  checked?: boolean;
}

export class Expense {
  private _id: string;
  private _date: Date;
  private _amount: number;
  private _category: string;
  private _type: string;
  private _label: string;
  private _periodicity: ExpensePeriodicity;
  private _deleted: boolean;
  private _checked: boolean;

  constructor(spec: ExpenseSpec = {}) {
    this._id = spec._id || guid();
    this._date = spec.date || new Date();
    this._amount = spec.amount || 0;
    this._category = spec.category || 'unknown';
    this._type = spec.type || DEFAULT_TYPE;
    this._label = spec.label || '';
    this._periodicity = spec.periodicity || DEFAULT_PERIODICITY;
    this._deleted = spec.deleted || false;
    this._checked = spec.checked || false;
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

  get type(): string {
    return this._type;
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

  delete(): void {
    this._deleted = true;
  }

  serialize(): Record<string, unknown> {
    return {
      _id: this._id,
      date: formatDateToDay(this.date),
      amount: this.amount,
      category: this.category,
      type: this.type,
      label: this.label,
      periodicity: this.periodicity,
      deleted: this.deleted,
      checked: this.checked,
    };
  }
}

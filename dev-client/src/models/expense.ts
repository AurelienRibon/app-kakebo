import { formatDateToDay } from '../lib/dates';
import { getExpenseDefaultType } from '../lib/expenses-types';
import { guid } from '../lib/utils';

const DEFAULT_TYPE = getExpenseDefaultType();

export class Expense {
  public readonly id: string;
  public readonly date: Date;
  public readonly amount: number;
  public readonly category: string;
  public readonly type: string;
  public readonly label: string;

  constructor(date = new Date(), amount = 0, category = 'unknown', type = DEFAULT_TYPE, label = '') {
    this.id = guid();
    this.date = date;
    this.amount = amount;
    this.category = category;
    this.type = type;
    this.label = label;
  }

  serialize(): Record<string, unknown> {
    return {
      date: formatDateToDay(this.date),
      amount: this.amount,
      category: this.category,
      type: this.type,
      label: this.label,
    };
  }
}

import { formatDateToDay } from '../lib/dates';
import { getExpenseDefaultType } from '../lib/expenses';
import { guid } from '../lib/utils';

export class Expense {
  public readonly id: string;
  public readonly date: Date;
  public readonly amount: number;
  public readonly category: string;
  public readonly type: string;

  constructor(date: Date, amount: number, category?: string, type?: string) {
    this.id = guid();
    this.date = date;
    this.amount = amount;
    this.category = category || 'unknown';
    this.type = type || getExpenseDefaultType();
  }

  serialize(): Record<string, unknown> {
    return {
      date: formatDateToDay(this.date),
      amount: this.amount,
      category: this.category,
      type: this.type,
    };
  }
}

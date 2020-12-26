import { getExpenseDefaultType } from '../lib/expenses';

export class Expense {
  public readonly id: string;
  public readonly date: Date;
  public readonly amount: number;
  public readonly category: string;
  public readonly type: string;

  constructor(id: string, date: Date, amount: number, category?: string, type?: string) {
    this.id = id;
    this.date = date;
    this.amount = amount;
    this.category = category || 'unknown';
    this.type = type || getExpenseDefaultType();
  }
}

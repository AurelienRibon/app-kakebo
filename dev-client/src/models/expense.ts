import { formatDateToDay } from '../lib/dates';
import { ExpensePeriodicity, getExpenseDefaultPeriodicity } from '../lib/expenses-periodicities';
import { getExpenseDefaultType } from '../lib/expenses-types';
import { guid } from '../lib/utils';

const DEFAULT_TYPE = getExpenseDefaultType();
const DEFAULT_PERIODICITY = getExpenseDefaultPeriodicity();

export class Expense {
  public readonly id: string;
  public readonly date: Date;
  public readonly amount: number;
  public readonly category: string;
  public readonly type: string;
  public readonly label: string;
  public readonly periodicity: ExpensePeriodicity;

  constructor(
    date = new Date(),
    amount = 0,
    category = 'unknown',
    type = DEFAULT_TYPE,
    label = '',
    periodicity = DEFAULT_PERIODICITY
  ) {
    this.id = guid();
    this.date = date;
    this.amount = amount;
    this.category = category;
    this.type = type;
    this.label = label;
    this.periodicity = periodicity;
  }

  serialize(): Record<string, unknown> {
    return {
      date: formatDateToDay(this.date),
      amount: this.amount,
      category: this.category,
      type: this.type,
      label: this.label,
      periodicity: this.periodicity,
    };
  }
}

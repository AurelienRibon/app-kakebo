import { formatDateToDay } from './dates';
import { str } from './utils';
import { Expense, getExpenseTypeDefs } from '../models/expense';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface SameDayExpenses {
  date: Date;
  expenses: Expense[];
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export function hasExpenseType(name: string): boolean {
  return getExpenseTypeDefs().some((it) => it.name === name);
}

export function createExpense(spec: Record<string, unknown>): Expense {
  const date = typeof spec.date === 'string' ? new Date(spec.date) : undefined;
  const amount = typeof spec.amount === 'number' ? spec.amount : undefined;
  const category = typeof spec.category === 'string' ? spec.category : undefined;

  if (date === undefined || !date.toJSON() || amount === undefined || category === undefined) {
    throw new Error(`Invalid expense specification: ${str(spec)}`);
  }

  const type = typeof spec.type === 'string' ? spec.type : '';
  const label = typeof spec.label === 'string' ? spec.label : '';
  const comment = typeof spec.comment === 'string' ? spec.comment : '';

  return new Expense(date, amount, category, type, label, comment);
}

export function splitExpensesByDay(expenses: Expense[]): SameDayExpenses[] {
  const expensesByDay: Map<string, Expense[]> = new Map();
  for (const expense of expenses) {
    const day = formatDateToDay(expense.date);

    let bucket = expensesByDay.get(day);
    if (!bucket) {
      bucket = [];
      expensesByDay.set(day, bucket);
    }

    bucket.push(expense);
  }

  const result: SameDayExpenses[] = [];
  for (const [day, bucket] of expensesByDay.entries()) {
    const date = new Date(day);
    result.push({ date, expenses: bucket });
  }

  return result;
}

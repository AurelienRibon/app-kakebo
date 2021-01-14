import { formatDateToDay } from './dates';
import { isPeriodicityValid } from './expenses-periodicities';
import { str } from './utils';
import { Expense } from '../models/expense';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface SameDayExpenses {
  date: Date;
  expenses: Expense[];
}

export type ExpenseJSON = Record<string, unknown>;

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export function createExpenseFromJSON(spec: ExpenseJSON): Expense {
  const _id = typeof spec._id === 'string' ? spec._id : undefined;
  const date = typeof spec.date === 'string' ? new Date(spec.date) : undefined;
  const amount = typeof spec.amount === 'number' ? spec.amount : undefined;
  const category = typeof spec.category === 'string' ? spec.category : undefined;

  if (date === undefined || !date.toJSON() || amount === undefined || category === undefined) {
    throw new Error(`Invalid expense specification: ${str(spec)}`);
  }

  const type = typeof spec.type === 'string' ? spec.type : undefined;
  const label = typeof spec.label === 'string' ? spec.label : undefined;
  const periodicity = isPeriodicityValid(spec.periodicity) ? spec.periodicity : undefined;
  const deleted = typeof spec.deleted === 'boolean' ? spec.deleted : undefined;

  return new Expense({ _id, date, amount, category, type, label, periodicity, deleted });
}

export function createExpensesFromJSON(specs: ExpenseJSON[]): Expense[] {
  const expenses = specs.map(createExpenseFromJSON);
  sortExpenses(expenses);
  return expenses;
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

export function extractExpensesLabels(expenses: Expense[], category: string): string[] {
  const counts = new Map() as Map<string, number>;

  for (const expense of expenses) {
    if (expense.label && expense.category === category) {
      const count = counts.get(expense.label) || 0;
      counts.set(expense.label, count + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => a[1] - b[1])
    .map((it) => it[0]);
}

export function sortExpenses(expenses: Expense[]): void {
  expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function computeMonthExpenses(expenses: Expense[], date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();

  return expenses
    .filter((it) => it.date.getFullYear() === year && it.date.getMonth() === month)
    .reduce((acc, it) => acc + Math.min(it.amount, 0), 0);
}

export function computeMonthBalance(expenses: Expense[], date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();

  return expenses
    .filter((it) => it.date.getFullYear() === year && it.date.getMonth() === month)
    .reduce((acc, it) => acc + it.amount, 0);
}

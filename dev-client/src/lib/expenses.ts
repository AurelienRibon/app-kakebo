import { formatDateToDay } from './dates';
import { str } from './utils';
import { Expense } from '../models/expense';
import expenseTypes from '../meta/expense-types.json';

type ExpenseTypeDef = { name: string; icon: string; default?: boolean };

const expenseTypesByName: ReadonlyMap<string, ExpenseTypeDef> = indexTypesByName();
const expenseDefaultType: string = lookupExpenseDefaultType();

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
  return expenseTypesByName.has(name);
}

export function getExpenseTypeDefs(): ExpenseTypeDef[] {
  return expenseTypes;
}

export function getExpenseDefaultCategory(): string {
  return 'unknown';
}

export function getExpenseDefaultType(): string {
  return expenseDefaultType;
}

export function createExpense(spec: Record<string, unknown>): Expense {
  const { date, amount, category } = spec;

  if (typeof date !== 'string' || typeof amount !== 'number' || typeof category !== 'string') {
    throw new Error(`Invalid expense specification, missing attributes. ${str(spec)}`);
  }

  const finalDate = new Date(date);
  if (!finalDate.toJSON()) {
    throw new Error(`Invalid expense specification, invalid date. ${str(spec)}`);
  }

  return new Expense(finalDate, amount, category);
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

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function indexTypesByName() {
  return new Map(expenseTypes.map((it) => [it.name, it]));
}

function lookupExpenseDefaultType() {
  for (const [name, def] of expenseTypesByName.entries()) {
    if (def.default) {
      return name;
    }
  }

  throw new Error(`No expense type was set as default.`);
}

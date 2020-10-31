import testExpensesSpecs from '../../../data/test-expenses.json';
import { formatDateToDay } from './dates';
import { Expense } from '../models/expense';
import expenseTypes from '../meta/expense-types.json';

type ExpenseTypeDef = { name: string; icon: string; default?: boolean };

const expenseTypesByName: ReadonlyMap<string, ExpenseTypeDef> = indexTypesByName();
const expenseTypeDefaultName: string = lookupExpenseTypeDefaultName();

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

export function getExpenseTypeDefaultName(): string {
  return expenseTypeDefaultName;
}

export async function getExpenses(): Promise<Expense[]> {
  return testExpensesSpecs.map((it) => new Expense(it));
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

function lookupExpenseTypeDefaultName() {
  for (const [name, def] of expenseTypesByName.entries()) {
    if (def.default) {
      return name;
    }
  }

  throw new Error(`No expense type was set as default.`);
}

import testExpensesSpecs from '../../../data/test-expenses.json';
import { formatDateToDay } from './dates';
import { Expense } from '../models/expense';
import expenseTypes from '../meta/expense-types.json';
import { guid } from './utils';

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

export async function loadExpenses(): Promise<Expense[]> {
  const expenses = [] as Expense[];

  for (const spec of testExpensesSpecs as Record<string, unknown>[]) {
    const expense = createExpense(spec);
    if (expense) {
      expenses.push(expense);
    }
  }

  return expenses;
}

export function createExpense(spec: Record<string, unknown>): Expense | undefined {
  const { id, date, amount, category } = spec;

  if (
    typeof id !== 'string' ||
    typeof date !== 'string' ||
    typeof amount !== 'number' ||
    typeof category !== 'string'
  ) {
    return;
  }

  const finalDate = new Date(date);
  if (id.length === 0 || !finalDate.toJSON()) {
    return;
  }

  return new Expense(id, finalDate, amount, category);
}

export function createNewExpense(spec: Record<string, unknown>): Expense {
  const expense = createExpense({ ...spec, id: guid() });
  if (!expense) {
    throw new Error('Invalid expense specification.');
  }
  return expense;
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

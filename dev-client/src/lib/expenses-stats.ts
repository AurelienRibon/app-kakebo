import { formatDateToDay, getCurrentDateComponents } from './dates';
import { mapGroups, sum } from './utils';
import { Expense } from '../models/expense';

// -----------------------------------------------------------------------------
// GROUPBY
// -----------------------------------------------------------------------------

export function groupExpensesBy<T>(expenses: Expense[], fn: (exp: Expense) => T): [T, Expense[]][] {
  const map = new Map<T, Expense[]>();

  for (const expense of expenses) {
    const key = fn(expense);
    let bucket = map.get(key);

    if (!bucket) {
      bucket = [];
      map.set(key, bucket);
    }

    bucket.push(expense);
  }

  return Array.from(map.entries());
}

export function groupExpensesByCategory(expenses: Expense[]): [string, Expense[]][] {
  return groupExpensesBy(expenses, (it) => it.category);
}

export function groupExpensesByDay(expenses: Expense[]): [string, Expense[]][] {
  return groupExpensesBy(expenses, (it) => formatDateToDay(it.date));
}

// -----------------------------------------------------------------------------
// FILTER
// -----------------------------------------------------------------------------

export function filterExpensesByDate(expenses: Expense[], fromDate: Date, toDate: Date): Expense[] {
  return expenses.filter((it) => {
    const time = it.date.getTime();
    return time >= fromDate.getTime() && time < toDate.getTime();
  });
}

export function filterExpensesOfMonth(expenses: Expense[], year: number, month: number): Expense[] {
  const fromDate = new Date(year, month);
  const toDate = month === 11 ? new Date(year + 1, 0) : new Date(year, month + 1);
  return filterExpensesByDate(expenses, fromDate, toDate);
}

export function filterExpensesOfCurrentMonth(expenses: Expense[]): Expense[] {
  const { year, month } = getCurrentDateComponents();
  return filterExpensesOfMonth(expenses, year, month);
}

// -----------------------------------------------------------------------------
// SUM
// -----------------------------------------------------------------------------

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((acc, it) => acc + it.amount, 0);
}

export function sumExpensesByCategory(expenses: Expense[], limit: number): [string, number][] {
  const groups = groupExpensesByCategory(expenses);
  const sums = sumGroups(groups);

  sums.sort((a, b) => a[1] - b[1]);

  if (sums.length < limit) {
    return sums;
  }

  const sums1 = sums.slice(0, limit);
  const sums2 = sums.slice(limit);
  const sums2Acc = sum(sums2.map((it) => it[1]));

  return [...sums1, ['autres', sums2Acc]];
}

export function sumExpensesByDay(expenses: Expense[]): [string, number][] {
  return sumGroups(groupExpensesByDay(expenses)).sort((a, b) => a[0].localeCompare(b[0]));
}

// -----------------------------------------------------------------------------
// COMPUTINGS
// -----------------------------------------------------------------------------

export function computeBalanceByDay(expenses: Expense[]): [string, number][] {
  let balance = 0;
  return sumGroups(groupExpensesByDay(expenses))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((it) => [it[0], (balance += it[1])]);
}

export function computeBalance(expenses: Expense[]): number {
  return sumExpenses(expenses);
}

export function computeBalanceOfDebits(expenses: Expense[]): number {
  return sumExpenses(expenses.filter((it) => it.amount < 0));
}

export function computeBalanceOfOneTimeDebits(expenses: Expense[]): number {
  return sumExpenses(expenses.filter((it) => it.amount < 0 && !it.isRecurring()));
}

export function computeBalanceOfRecurringDebits(expenses: Expense[]): number {
  return sumExpenses(expenses.filter((it) => it.amount < 0 && it.isRecurring()));
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function sumGroups<T>(groups: [T, Expense[]][]) {
  return mapGroups(groups, (key, val) => sum(val.map((it) => it.amount)));
}

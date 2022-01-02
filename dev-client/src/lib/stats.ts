import { addMonthsToDate, formatDateToDay, formatDateToMonth, getEndOfMonthDate, getStartOfMonthDate } from './dates';
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

export function groupExpensesByMonth(expenses: Expense[]): [string, Expense[]][] {
  return groupExpensesBy(expenses, (it) => formatDateToMonth(it.date));
}

// -----------------------------------------------------------------------------
// FILTER
// -----------------------------------------------------------------------------

export function filterNonExceptionalExpenses(expenses: Expense[]): Expense[] {
  return expenses.filter((it) => !it.exceptional);
}

export function filterExpensesByDate(expenses: Expense[], fromDate: Date, toDate: Date): Expense[] {
  return expenses.filter((it) => {
    const time = it.date.getTime();
    return time >= fromDate.getTime() && time < toDate.getTime();
  });
}

export function filterExpensesOfMonth(expenses: Expense[], date: Date): Expense[] {
  const fromDate = getStartOfMonthDate(date);
  const toDate = getEndOfMonthDate(date);
  return filterExpensesByDate(expenses, fromDate, toDate);
}

export function filterExpensesOfCurrentMonth(expenses: Expense[]): Expense[] {
  return filterExpensesOfMonth(expenses, new Date());
}

export function filterExpensesOfLastMonths(expenses: Expense[], months: number): Expense[] {
  const startDate = getStartOfMonthDate(new Date());
  const pastDate = addMonthsToDate(startDate, -months);
  return filterExpensesByDate(expenses, pastDate, new Date());
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
// BALANCE
// -----------------------------------------------------------------------------

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

export function computeBalanceByMonth(expenses: Expense[]): [string, number][] {
  return sumGroups(groupExpensesByMonth(expenses)).sort((a, b) => a[0].localeCompare(b[0]));
}

export function computeBalanceOfDebitsByMonth(expenses: Expense[]): [string, number][] {
  return computeBalanceByMonth(expenses.filter((it) => it.amount < 0));
}

export function computeAggregatedBalanceByDay(expenses: Expense[]): [string, number][] {
  let balance = 0;
  return sumGroups(groupExpensesByDay(expenses))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((it) => [it[0], (balance += it[1])]);
}

export function computeAggregatedBalanceByMonth(expenses: Expense[]): [string, number][] {
  let balance = 0;
  return sumGroups(groupExpensesByMonth(expenses))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((it) => [it[0], (balance += it[1])]);
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function sumGroups<T>(groups: [T, Expense[]][]) {
  return mapGroups(groups, (key, val) => sum(val.map((it) => it.amount)));
}

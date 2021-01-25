import { Expense } from '../models/expense';
import { groupExpensesByCategory, groupExpensesByDay } from './expenses';
import { mapGroups, sum } from './utils';

// -----------------------------------------------------------------------------
// SUM BY CATEGORY
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// SUM BY DAY
// -----------------------------------------------------------------------------

export function sumExpensesByDay(expenses: Expense[]): [string, number][] {
  return sumGroups(groupExpensesByDay(expenses)).sort((a, b) => a[0].localeCompare(b[0]));
}

export function computeBalanceByDay(expenses: Expense[]): [string, number][] {
  let balance = 0;
  return sumGroups(groupExpensesByDay(expenses))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((it) => [it[0], (balance += it[1])]);
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function sumGroups<T>(groups: [T, Expense[]][]) {
  return mapGroups(groups, (key, val) => sum(val.map((it) => it.amount)));
}

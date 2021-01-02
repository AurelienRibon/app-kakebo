import { formatDateToDay } from './dates';
import { Expense } from '../models/expense';

interface SameDayExpenses {
  date: Date;
  expenses: Expense[];
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

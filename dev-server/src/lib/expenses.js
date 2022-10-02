'use strict';

const { getDateForFirstDayOfCurrentMonth, getDateDayString, isSameMonth } = require('./dates');
const { guid } = require('./utils');

exports.convertExpensesForDB = function (expenses) {
  return expenses.map((it) => ({ ...it, updatedAt: new Date(it.updatedAt) }));
};

exports.diffExpenses = function (newExpenses, oldExpenses) {
  const oldExpensesById = new Map(oldExpenses.map((it) => [it._id, it]));
  const expensesToUpsert = [];

  for (const newExpense of newExpenses) {
    const oldExpense = oldExpensesById.get(newExpense._id);

    if (!oldExpense || oldExpense.updatedAt === undefined || newExpense.updatedAt > oldExpense.updatedAt) {
      expensesToUpsert.push(newExpense);
    }
  }

  return expensesToUpsert;
};

exports.duplicateExpenses = function (expenses) {
  const date = getDateDayString(getDateForFirstDayOfCurrentMonth());
  return expenses.map((it) => ({ ...it, _id: guid(), checked: false, date, updatedAt: new Date() }));
};

exports.findRecurringExpensesToDuplicate = function (expenses) {
  const today = new Date();

  const lastMonthlyExpense = expenses
    .filter((it) => it.periodicity === 'monthly' && new Date(it.date) <= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .pop();

  const lastMonthlyExpenseDate = new Date(lastMonthlyExpense.date);

  if (isSameMonth(lastMonthlyExpenseDate, today)) {
    return [];
  }

  const lastMonthlyExpenseDatePrefix = lastMonthlyExpense.date.slice(0, 7); // slicing YYYY-MM out of date
  const lastMonthlyExpenses = expenses.filter(
    (it) => it.date.startsWith(lastMonthlyExpenseDatePrefix) && it.periodicity === 'monthly' && !it.deleted
  );

  return lastMonthlyExpenses;
};

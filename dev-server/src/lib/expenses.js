'use strict';

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

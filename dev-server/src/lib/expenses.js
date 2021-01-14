'use strict';

exports.diffExpenses = function (newExpenses, oldExpenses) {
  const oldExpensesById = new Map(oldExpenses.map((it) => [it._id, it]));
  const expensesToAdd = [];
  const expensesToDelete = [];

  for (const newExpense of newExpenses) {
    const oldExpense = oldExpensesById.get(newExpense._id);

    if (!oldExpense) {
      expensesToAdd.push(newExpense);
    } else if (newExpense.deleted && !oldExpense.deleted) {
      expensesToDelete.push(newExpense);
    }
  }

  return [expensesToAdd, expensesToDelete];
};

'use strict';

const db = require('./lib/db');
const { createTimer } = require('./lib/utils');
const { convertExpensesForDB, diffExpenses } = require('./lib/expenses');
const { duplicateExpenses, findRecurringExpensesToDuplicate } = require('./lib/expenses');

exports.handler = async (event) => {
  const body = event.body && JSON.parse(event.body);
  const route = routes[body?.route ?? '/'];
  return route(body);
};

// -----------------------------------------------------------------------------
// ROUTES
// -----------------------------------------------------------------------------

const routes = {
  '/': async () => {
    return 'Hello!';
  },

  '/expenses': async () => {
    const timer = createTimer();

    await db.connect();
    timer('db.connect');

    const expenses = await db.getExpenses();
    timer('db.getExpenses');

    return {
      times: timer.times,
      expenses,
    };
  },

  '/expenses/sync': async (body) => {
    const timer = createTimer();

    await db.connect();
    timer('db.connect');

    const userExpenses = convertExpensesForDB(body.expenses);
    const knownExpenses = await db.getExpenses();
    timer('db.getExpenses');

    const expensesToUpsertForServer = diffExpenses(userExpenses, knownExpenses);
    const expensesToUpsertForUser = diffExpenses(knownExpenses, userExpenses);
    timer('diff');

    const expensesToDuplicate = findRecurringExpensesToDuplicate(knownExpenses);
    const expensesToInsert = duplicateExpenses(expensesToDuplicate);
    timer('duplicate');

    await db.upsertExpenses([...expensesToUpsertForServer, ...expensesToInsert]);

    return {
      times: timer.times,
      nbServer: expensesToUpsertForServer.length,
      nbUser: expensesToUpsertForUser.length,
      nbDupl: expensesToInsert.length,
      expenses: [...expensesToUpsertForUser, ...expensesToInsert],
    };
  },
};

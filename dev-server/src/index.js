'use strict';

const express = require('express');
const compression = require('compression');
const db = require('./db');
const {
  convertExpensesForDB,
  diffExpenses,
  duplicateExpenses,
  findRecurringExpensesToDuplicate,
} = require('./lib/expenses');

const PORT = process.env.PORT || 5555;

const app = express();

app.set('json spaces', 2);
app.use(compression());
app.use(express.json({ limit: '50mb' }));

setupAndStart();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// -----------------------------------------------------------------------------
// ROUTES
// -----------------------------------------------------------------------------

app.get('/expenses', async (req, res) => {
  const expenses = await db.getExpenses();
  res.send(expenses);
});

app.post('/expenses/sync', async (req, res) => {
  const t1 = Date.now();

  const userExpenses = convertExpensesForDB(req.body.expenses);
  const knownExpenses = await db.getExpenses();

  const t2 = Date.now();

  const expensesToUpsertForServer = diffExpenses(userExpenses, knownExpenses);
  const expensesToUpsertForUser = diffExpenses(knownExpenses, userExpenses);

  const t3 = Date.now();

  const expensesToDuplicate = findRecurringExpensesToDuplicate(knownExpenses);
  const expensesToInsert = duplicateExpenses(expensesToDuplicate);

  const t4 = Date.now();

  const d1 = (t2 - t1).toFixed(2);
  const d2 = (t3 - t2).toFixed(2);
  const d3 = (t4 - t2).toFixed(2);

  const nbServer = expensesToUpsertForServer.length;
  const nbUser = expensesToUpsertForUser.length;
  const nbDupl = expensesToInsert.length;

  console.log(`fetch:${d1}ms, diff:${d2}ms, dupl:${d3}ms`);
  console.log(`expensesToUpsertForServer:${nbServer}, expensesToUpsertForUser:${nbUser}, expensesToInsert:${nbDupl}`);

  await db.upsertExpenses([...expensesToUpsertForServer, ...expensesToInsert]);

  res.send([...expensesToUpsertForUser, ...expensesToInsert]);
});

// -----------------------------------------------------------------------------
// MISC
// -----------------------------------------------------------------------------

async function setupAndStart() {
  console.log('Connecting to database...');
  await db.connect();

  console.log('Starting server...');
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
  });
}

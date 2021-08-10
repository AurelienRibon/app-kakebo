'use strict';

const express = require('express');
const compression = require('compression');
const db = require('./db');
const { convertExpensesForDB, diffExpenses } = require('./lib/expenses');

const PORT = process.env.PORT || 5000;

const app = express();

app.set('json spaces', 2);
app.use(compression());
app.use(express.json({ limit: '50mb' }));

setupAndStart();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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

  const nbServer = expensesToUpsertForServer.length;
  const nbUser = expensesToUpsertForUser.length;
  const d1 = (t2 - t1).toFixed(2);
  const d2 = (t3 - t2).toFixed(2);

  console.log(`fetch:${d1}ms, diff:${d2}ms`);
  console.log(`expensesToUpsertForServer:${nbServer}, expensesToUpsertForUser:${nbUser}`);

  await db.upsertExpenses(expensesToUpsertForServer);

  res.send(expensesToUpsertForUser);
});

// -----------------------------------------------------------------------------
// MISC
// -----------------------------------------------------------------------------

async function setupAndStart() {
  console.log('Connecting to database...');
  await db.connect();

  console.log('Starting server...');
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.\n`);
  });
}

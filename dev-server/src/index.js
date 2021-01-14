'use strict';

const express = require('express');
const compression = require('compression');
const db = require('./db');
const { diffExpenses } = require('./lib/expenses');

const PORT = process.env.PORT || 4000;

const app = express();

app.set('json spaces', 2);
app.use(compression());
app.use(express.json());

setupAndStart();

// -----------------------------------------------------------------------------
// ROUTES
// -----------------------------------------------------------------------------

app.get('/expenses', async (req, res) => {
  const expenses = await db.getExpenses();
  res.send(expenses);
});

app.post('/expenses/update', async (req, res) => {
  const newExpenses = req.body;
  const oldExpenses = await db.getExpenses();
  const { expensesToAdd, expensesToDelete } = diffExpenses(newExpenses, oldExpenses);

  await db.addExpenses(expensesToAdd);
  await db.deleteExpenses(expensesToDelete);

  res.send({
    expensesAdded: expensesToAdd.length,
    expensesDeleted: expensesToDelete.length,
  });
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

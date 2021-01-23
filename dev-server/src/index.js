'use strict';

const express = require('express');
const compression = require('compression');
const db = require('./db');
const { diffExpenses } = require('./lib/expenses');

const PORT = process.env.PORT || 5000;

const app = express();

app.set('json spaces', 2);
app.use(compression());
app.use(express.json());

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
  const userExpenses = req.body.expenses;
  const knownExpenses = await db.getExpenses();

  const [userExpensesToAdd, userExpensesToDelete] = diffExpenses(knownExpenses, userExpenses);
  const [knownExpensesToAdd, knownExpensesToDelete] = diffExpenses(userExpenses, knownExpenses);

  const nbAdded = knownExpensesToAdd.length;
  const nbDeleted = knownExpensesToDelete.length;
  const nbToAdd = userExpensesToAdd.length;
  const nbToDelete = userExpensesToDelete.length;

  console.log(`nbAdded:${nbAdded}, nbDeleted:${nbDeleted}, nbToAdd:${nbToAdd}, nbToDelete:${nbToDelete}`);

  await db.addExpenses(knownExpensesToAdd);
  await db.deleteExpenses(knownExpensesToDelete);

  res.send({
    expensesAdded: nbAdded,
    expensesDeleted: nbDeleted,
    expensesToAdd: userExpensesToAdd,
    expensesToDelete: userExpensesToDelete,
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

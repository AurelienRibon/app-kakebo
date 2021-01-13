'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const { MongoClient } = require('mongodb');
const db = require('./db');

const PORT = process.env.PORT || 4000;

const app = express();

app.set('json spaces', 2);
app.use(compression());
app.post('*', bodyParser.json());

setupAndStart();

// -----------------------------------------------------------------------------
// ROUTES
// -----------------------------------------------------------------------------

app.get('/expenses', async (req, res) => {
  const expenses = await db.getExpenses();
  res.send(expenses);
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

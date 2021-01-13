'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const moment = require('moment');

const PORT = process.env.PORT || 4000;

const app = express();

app.set('json spaces', 2);
app.use(compression());
app.post('*', bodyParser.json());

setupAndStart();

// -----------------------------------------------------------------------------
// LOGS
// -----------------------------------------------------------------------------

app.use((req, res, next) => {
  const date = moment.utc().format('YYYY-MM-DDTHH:mm:ss');
  console.log(`${date} [${req.ip}] ${req.method} ${req.originalUrl}`);
  return next();
});

// -----------------------------------------------------------------------------
// ROUTES
// -----------------------------------------------------------------------------

app.get('/hello', (req, res) => {
  const id = req.params.id;
  return res.send('Hello!');
});

// -----------------------------------------------------------------------------
// MISC
// -----------------------------------------------------------------------------

async function setupAndStart() {
  process.stdout.write('Starting server...');

  app.listen(PORT, () => {
    process.stdout.write(' OK!\n');
    process.stdout.write(`Server is listening on port ${PORT}.\n`);
  });
}

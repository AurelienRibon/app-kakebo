'use strict';

const { MongoClient } = require('mongodb');

const HOST = process.env.MONGO_KAKEBO_HOST;
const USER = process.env.MONGO_KAKEBO_USER;
const PASS = process.env.MONGO_KAKEBO_PASS;
const DATA = process.env.MONGO_KAKEBO_DATA ?? 'test';
const URI = `mongodb+srv://${USER}:${PASS}@${HOST}?retryWrites=true&w=majority`;

const db = { expenses: null };

exports.connect = async function () {
  try {
    const client = new MongoClient(URI, { useUnifiedTopology: true });
    const conn = await client.connect();
    db.expenses = conn.db(DATA).collection('expenses');
  } catch (err) {
    console.error('Connection to database failed.');
    console.error(err.stack);
    process.exit(1);
  }
};

exports.getExpenses = async function () {
  return db.expenses.find().toArray();
};

exports.upsertExpenses = async function (expenses) {
  if (expenses.length === 0) {
    return;
  }

  const operations = expenses.map((it) => ({
    replaceOne: {
      filter: { _id: it._id },
      replacement: it,
      upsert: true,
    },
  }));

  await db.expenses.bulkWrite(operations);
};

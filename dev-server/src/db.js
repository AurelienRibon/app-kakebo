'use strict';

const { MongoClient } = require('mongodb');

const HOST = process.env.MONGO_KAKEBO_HOST;
const USER = process.env.MONGO_KAKEBO_USER;
const PASS = process.env.MONGO_KAKEBO_PASS;
const COLL = process.env.MONGO_KAKEBO_COLL;
const URI = `mongodb+srv://${USER}:${PASS}@${HOST}?retryWrites=true&w=majority`;

const db = { expenses: null };

exports.connect = async function () {
  try {
    const client = new MongoClient(URI, { useUnifiedTopology: true });
    const conn = await client.connect();
    db.expenses = conn.db(COLL).collection('expenses');
  } catch (err) {
    console.error('Connection to database failed.');
    console.error(err.stack);
    process.exit(1);
  }
};

exports.getExpenses = async function () {
  return db.expenses.find().toArray();
};

exports.addExpenses = async function (newExpenses) {
  if (newExpenses.length > 0) {
    await db.expenses.insertMany(newExpenses);
  }
};

exports.deleteExpenses = async function (expenses) {
  for (const expense of expenses) {
    await db.expenses.updateOne({ _id: expense._id }, { $set: { deleted: true } });
  }
};

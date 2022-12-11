'use strict';

const { MongoClient } = require('mongodb');

const HOST = process.env.MONGO_KAKEBO_HOST;
const USER = process.env.MONGO_KAKEBO_USER;
const PASS = process.env.MONGO_KAKEBO_PASS;
const DB = process.env.MONGO_KAKEBO_DB ?? 'test';
const URI = `mongodb+srv://${USER}:${PASS}@${HOST}?retryWrites=true&w=majority`;

const client = new MongoClient(URI);
let connected = false;

exports.connect = async function () {
  if (!connected) {
    console.log('[db] Connecting to DBbase...');
    await client.connect();
    connected = true;
    console.log('[db] Connected!');
  } else {
    console.log('[db] Already connected!');
  }
};

exports.getExpenses = async function () {
  console.log('[db] Fetching all expenses...');
  const result = await client.db(DB).collection('expenses').find().toArray();
  console.log('[db] Fetching done!');
  return result;
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

  await client.db(DB).collection('expenses').bulkWrite(operations);
};

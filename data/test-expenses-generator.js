const fs = require('fs');
const categories = require('../dev-client/src/meta/categories.json');

const DAYS_PER_MONTH = {
  0: 31,
  1: 28,
  2: 31,
  3: 30,
  4: 31,
  5: 30,
  6: 31,
  7: 31,
  8: 30,
  9: 31,
  10: 30,
  11: 31,
};

// -----------------------------------------------------------------------------
// SCRIPT
// -----------------------------------------------------------------------------

const data = [];

for (const date of generateRandomDates()) {
  const categoryIndex = randInt(0, categories.length);
  const category = categories[categoryIndex];
  const amount = Math.floor(Math.random() * 10000) / 100;
  data.push({ date: date.toISOString(), category: category.name, amount });
}

fs.writeFileSync(`${__dirname}/test-expenses.json`, JSON.stringify(data, null, 2));
console.log(`Generated ${data.length} expenses.`);

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function* generateRandomDates() {
  for (let month = 11; month >= 0; --month) {
    for (let day = DAYS_PER_MONTH[month]; day >= 1; --day) {
      for (let i = randInt(0, 10); i >=0; --i) {
        const hours = randInt(0, 24);
        const minutes = randInt(0, 60);
        const seconds = randInt(0, 60);
        yield new Date(Date.UTC(2020, month, day, hours, minutes, seconds));
      }
    }
  }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

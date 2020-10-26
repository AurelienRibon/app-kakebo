const fs = require('fs');
const categories = require('../dev-client/src/meta/categories.json');

// -----------------------------------------------------------------------------
// SCRIPT
// -----------------------------------------------------------------------------

const data = [];

for (const date of generateRandomDates()) {
  const categoryIndex = randInt(0, categories.length);
  const category = categories[categoryIndex];
  const amount = -Math.floor(Math.random() * 10000) / 100;
  data.push({ date: date.toISOString(), category: category.name, amount });
}

fs.writeFileSync(`${__dirname}/test-expenses.json`, JSON.stringify(data, null, 2));
console.log(`Generated ${data.length} expenses.`);

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function* generateRandomDates() {
  for (let i = 0; i < 7; ++i) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    for (let i = randInt(0, 10); i >= 0; --i) {
      yield date;
    }
  }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

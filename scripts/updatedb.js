const UUID_ALPHABET_1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const UUID_ALPHABET_2 = UUID_ALPHABET_1 + "0123456789";

function guid() {
  const chars = new Array(8);
  chars[0] = UUID_ALPHABET_1[randInt(UUID_ALPHABET_1.length)];
  for (let i = 1; i < chars.length; ++i) {
    chars[i] = UUID_ALPHABET_2[randInt(UUID_ALPHABET_2.length)];
  }
  return chars.join("");
}

function randInt(max) {
  return Math.floor(Math.random() * max);
}

var exps = db.expenses.find({ periodicity: "monthly", deleted: false, date: '2021-10-01' }).toArray();
exps.forEach((it) => (it.date = "2021-11-01"));
exps.forEach((it) => (it.checked = false));
exps.forEach((it) => (it._id = guid()));
db.expenses.insertMany(exps);

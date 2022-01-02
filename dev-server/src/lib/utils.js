'use strict';

const UUID_ALPHABET_1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const UUID_ALPHABET_2 = UUID_ALPHABET_1 + '0123456789';

exports.guid = function () {
  const chars = new Array(8);
  chars[0] = UUID_ALPHABET_1[exports.randInt(UUID_ALPHABET_1.length)];

  for (let i = 1; i < chars.length; ++i) {
    chars[i] = UUID_ALPHABET_2[exports.randInt(UUID_ALPHABET_2.length)];
  }

  return chars.join('');
};

exports.randInt = function (max) {
  return Math.floor(Math.random() * max);
};

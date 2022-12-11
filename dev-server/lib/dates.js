'use strict';

exports.getDateForFirstDayOfCurrentMonth = function () {
  const date = new Date();
  date.setDate(1);
  return date;
};

exports.getDateDayString = function (date) {
  return date.toISOString().slice(0, 10);
};

exports.isSameMonth = function (date1, date2) {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

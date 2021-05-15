const app = getApp();

import moment from 'moment'
import {get} from './request'

function getDeadline(time) {
  return moment(time).utcOffset(-1 * new Date().getTimezoneOffset()).format('YYYY/MM/DD HH:mm:ss')
};

function diffDeadlineTime(time) {
  return moment(time).utcOffset(-1 * new Date().getTimezoneOffset()).diff(moment(), "milliseconds");
};

function showOverallRank(rank) {
  if (rank < 1000) {
    return rank
  } else if (rank < 1000000) {
    return Math.floor(rank / 1000) + 'k'
  }
  return Math.floor(rank / 100000) / 10 + 'm'
};

function showChip(chip) {
  if (chip === 'wildcard') {
    return "WC";
  } else if (chip === '3xc') {
    return "TC";
  } else if (chip === 'bboost') {
    return "BB";
  } else if (chip === 'freehit') {
    return "FH";
  }
  return "无"
};

function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 1:
    case 2: {
      return '#00FF86';
    }
    case 3: {
      return 'gray';
    }
    case 4: {
      return '#FF005A';
    }
    case 5: {
      return '#861D46';
    }
    default: {
      return 'black';
    }
  }
};

function numAdd(num1, num2) {
  let baseNum, baseNum1, baseNum2;
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  return (num1 * baseNum + num2 * baseNum) / baseNum;
};

function numSub(num1, num2) {
  let baseNum, baseNum1, baseNum2;
  let precision;
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};

function compareAscSort(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
};

function compareDescSort(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
  }
};

export {
  getDeadline,
  diffDeadlineTime,
  showOverallRank,
  showChip,
  getDifficultyColor,
  numAdd,
  numSub,
  compareAscSort,
  compareDescSort,
}
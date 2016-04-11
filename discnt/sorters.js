'use strict';

Array.prototype.swap = function (i, k) {
  let tmp = this[i];
  this[i] = this[k];
  this[k] = tmp;
}

module.exports = {
  selection: selectionSort,
  insertion: insertionSort
}

function selectionSort(array, limit) {
  let out = array.slice(),
    len = out.length;
  for (let i = 0; i < (limit || len - 1); i++) {
    let maxIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (gt(out[j], out[maxIndex])) {
        maxIndex = j;
      }
    }
    out.swap(i, maxIndex);
  }
  return out;
}

function insertionSort (array) {
  let out = array.slice(),
    len = out.length;
  for (let i = 1; i < len; i++) {
    let currPos = i;
    while (currPos > 0 && gt(out[currPos], out[currPos - 1])) {
      out.swap(currPos, currPos - 1);
      --currPos;
    }
  }
  return out;
}

function lt (a, b) {
  return a < b;
}

function gt (a, b) {
  return a > b;
}
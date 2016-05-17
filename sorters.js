'use strict';

Array.prototype.swap = function (i, k) {
  let tmp = this[i];
  this[i] = this[k];
  this[k] = tmp;
}

module.exports = {
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort()
}

function selectionSort(array, limit) {
  let out = array.slice(),
    len = out.length;
  for (let i = 0; i < (limit || len - 1); i++) {
    let maxIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (lt(out[j], out[maxIndex])) {
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
    while (currPos > 0 && lt(out[currPos], out[currPos - 1])) {
      out.swap(currPos, currPos - 1);
      --currPos;
    }
  }
  return out;
}

function mergeSort() {
  let input, results;
  return function(array) {
    let l = array.length;
    input = array;
    results = Array.apply(null, Array(l)).map(() => {});
    return mergeSortRecursive(0, l - 1);
  }
  function mergeSortRecursive(left, right) {
    if ( left < right ) {
      let middle = parseInt((left + right) / 2);
      mergeSortRecursive(left, middle);
      mergeSortRecursive(middle + 1, right);
      merge(left, middle + 1, right);
    }
    return input;
  }
  function merge (leftStart, rightStart, rightEnd) {
    let leftEnd = rightStart - 1,
      leftReadPos = leftStart,
      rightReadPos = rightStart,
      resultWritePos = leftStart;

    while (leftReadPos <= leftEnd && rightReadPos <= rightEnd) {
      if (lt(input[leftReadPos], input[rightReadPos])) {
        results[resultWritePos] = input[leftReadPos];
        ++leftReadPos;
      } else {
        results[resultWritePos] = input[rightReadPos];
        ++rightReadPos;
      }
      ++resultWritePos;
    }

    while (leftReadPos <= leftEnd) {
      results[resultWritePos] = input[leftReadPos];
      ++leftReadPos;
      ++resultWritePos;
    }

    while (rightReadPos <= rightEnd) {
      results[resultWritePos] = input[rightReadPos];
      ++rightReadPos;
      ++resultWritePos;
    }

    // slow
    // input.splice(leftStart, rightEnd + 1 - leftStart, ...results.slice(leftStart, rightEnd + 1));

    // faster
    // results.slice(leftStart, rightEnd + 1).map(function(item, i) {
    //   input[leftStart + i] = item;
    // });

    // the fastest
    while (leftStart <= rightEnd) {
      input[leftStart] = results[leftStart];
      ++leftStart;
    }

  }
}

function lt (a, b) {
  return a < b;
}

function gt (a, b) {
  return a > b;
}
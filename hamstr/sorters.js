'use strict';

module.exports = {
  merge: mergeSort()
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
    while (leftStart <= rightEnd) {
      input[leftStart] = results[leftStart];
      ++leftStart;
    }

  }
}

function lt (a, b) {
  return a < b;
}
'use strict';
const fs = require('fs');

const taskName = 'bugtrk';
const inputFileName = process.argv[2] || taskName + '.in',
  outputFileName = process.argv[3] || taskName + '.out';

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  const source = data.split(' ').map(x => parseInt(x));
  const N = source[0];
  let W = source[1],
    H = source[2];
  if (W > H) {
    let tmp = W;
    W = H;
    H = tmp;
  }
  const comparator = curry(fitsInsideSquare)(N, W, H);
  let smallestSq = binarySearchLeftMost(H, N * H, comparator);
  fs.writeFile(outputFileName, N, err => {
    if (err) throw err;
    // fingers crossed :)
  });
});

function fitsInsideSquare(N, W, H, S) {
  let maxRectInRow = Math.floor(S / W),
    maxRows = Math.floor(S / H);
  return maxRectInRow * maxRows >= N;
}

function binarySearchLeftMost(left, right, comparator) {
  while (right - left > 1) {
    let middle = left + Math.floor((right-left) / 2);
    if (comparator(middle)) {
      right = middle;
    } else {
      left = middle;
    }
  }
  return comparator(left) ? left : right;
}

function curry(fn) {
  var args = [].slice.call(arguments, 1);
  function curried(fnArgs) {
    if (fnArgs.length >= fn.length) {
      return fn.apply(null, fnArgs);
    }
    return function () {
      return curried(fnArgs.concat([].slice.apply(arguments)));
    };
  }
  return curried(args);
}
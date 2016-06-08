'use strict';
// console.time('Took: ');
const fs = require('fs');

const taskName = 'sigkey';
const inputFileName = process.argv[2] || taskName + '.in',
  outputFileName = process.argv[3] || taskName + '.out';

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  const source = data.split('\n');
  const N = parseInt(source[0]);
  let keys = new Array(N)
  let i = N;
  let totalPairs = 0,
    pairs = new Set(),
    a = 'a'.charCodeAt(0);
  while (i--) {
    let mask = 0,
      key = source[i+1],
      l = key.length;
    while (l--) {
      mask |= 1 << (key.charCodeAt(l) - a);
    }
    keys[i] = mask
  }
  keys.sort((a,b) => b-a);
  while (++i < N) {
    let key = keys[i];
    if (pairs.has(key)) {
      ++totalPairs;
      pairs.delete(key);
    } else {
      let l = key.toString(2).length, mask = 0;
      pairs.add(((1 << l) - 1) ^ key);
    }
  }
  fs.writeFile(outputFileName, totalPairs, err => {
    if (err) throw err;
    // console.log(`Total: ${totalPairs} pairs`);
    // console.timeEnd('Took: ');
  });
});

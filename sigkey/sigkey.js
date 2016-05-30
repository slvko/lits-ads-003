'use strict';
console.time('Took: ');
const fs = require('fs');

const taskName = 'sigkey';
const inputFileName = process.argv[2] || taskName + '.in',
  outputFileName = process.argv[3] || taskName + '.out';

const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const alphabetLength = alphabet.length;

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  const source = data.split('\n');
  const N = parseInt(source[0]);
  let i = N;
  let publics = [],
    privates = [];
  while (i--) {
    let key = source[i + 1];
    if (-1 === key.indexOf('a')) {
      privates.push(key);
    } else {
      publics.push(key);
    }
  }
  privates.sort();
  publics.sort();
  let totalPairs = 0,
    lpub = publics.length,
    ipub = 0;
  while (ipub < lpub && privates.length) {
    let pub = publics[ipub],
      ipriv = privates.length;
    while (ipriv--) {
      let priv = privates[ipriv];
      if (isKeyPair(priv, pub)) {
        ++totalPairs;
        privates.splice(ipriv, 1);
        break;
      }
    }
    // move on...
    ++ipub;
  }
  fs.writeFile(outputFileName, totalPairs, err => {
    if (err) throw err;
    console.log(`Total: ${totalPairs} pairs`);
    console.timeEnd('Took: ');
  });
});

function isKeyPair(first, second) {
  let result = true,
    lastIndexFirst = first.length - 1,
    lastIndexSecond = second.length - 1;
  let occurrences = Array(alphabetLength);
  // let keyMap = {};
  for (let i = 0; i < alphabetLength; i++) {
    let char = alphabet[i],
      index1 = first.indexOf(char),
      index2 = second.indexOf(char),
      exists = -1 === index1 ? 0 : 1;
    exists += -1 === index2 ? 0 : 1;
    if (2 === exists) {
      // duplicate
      return false;
    }
    occurrences[i] = exists;
  }
  return -1 === occurrences.indexOf(0)
    || occurrences.indexOf(0) > occurrences.lastIndexOf(1);
}

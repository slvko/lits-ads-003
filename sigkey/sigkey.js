'use strict';
console.time('Took: ');
const fs = require('fs');

const taskName = 'sigkey';
const inputFileName = process.argv[2] || taskName + '.in',
  outputFileName = process.argv[3] || taskName + '.out';

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  const source = data.split('\n');
  const N = parseInt(source[0]);
  let i = N;
  let keysAry = Array(N), keysMap = {};
  while (i--) {
    let key = source[i + 1];
    keysAry[i] = key;
    keysMap[key] = false;
  }
  let totalPairs = 0;
  while (keysAry.length > 1) {
    let keyToTest = keysAry.pop();
    for (let i = keysAry.length; i--;) {
      let key = keysAry[i];
      if (!isKeyPair(key, keyToTest)) {
        continue;
      }
      keysAry.splice(i, 1);
      keysMap[key] = true;
      keysMap[keyToTest] = true;
      ++totalPairs;
    }
  }
  fs.writeFile(outputFileName, totalPairs, err => {
    if (err) throw err;
    console.log(`Total: ${totalPairs} pairs`);
    console.timeEnd('Took: ');
  });
});

const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const alphabetLength = alphabet.length;

function isKeyPair(first, second) {
  let result = true;
  // let keyMap = {};
  let seqLength = 0;
  for (let i = 0; i < alphabetLength; i++) {
    let char = alphabet[i],
      nextChar = alphabet[i + 1],
      index1 = first.indexOf(char),
      index2 = second.indexOf(char),
      exists = -1 === index1 ? 0 : 1;
    exists += -1 === index2 ? 0 : 1;
    if (2 === exists) {
      // duplicate
      seqLength = 0;
      break;
    }
    if (!exists && nextChar && (-1 === first.indexOf(nextChar) || -1 === second.indexOf(nextChar))) {
      // either an end of a valid sequence or a gap
      seqLength = first.indexOf(nextChar) === second.indexOf(nextChar) ? seqLength : 0;
      break;
    }
    ++seqLength;
  }
  return !!seqLength;
}

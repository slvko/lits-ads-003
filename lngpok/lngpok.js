'use strict';
// console.time('Took: ');
const fs = require('fs');
// const sorters = require('./sorters');

const taskName = 'lngpok';
const inputFileName = process.argv[2] || taskName + '.in',
  outputFileName = process.argv[3] || taskName + '.out';

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  let cards = data.split(' ').map(x => parseInt(x));
  let maxCard = Math.max(...cards);
  let cardsMap = {};
  let cardsAry = [];
  let i = cards.length, zeroesCnt = 0;
  while (i) {
    if (0 === cards[--i]) {
      ++zeroesCnt;
      continue;
    }
    if (cardsMap[cards[i]]) {
      continue;
    }
    cardsMap[cards[i]] = true;
    cardsAry.push(cards[i]);
  }
  // cardsAry = sorters.merge(cardsAry);
  let longestSeqLength = 1;
  cardsAry.forEach(card => {
    if (cardsMap[card - 1]) {
      // do not count for second-in-row number
      return null;
    }
    let zeroFills = zeroesCnt;
    let currentSeqLength = 1;
    while (cardsMap[card + currentSeqLength] || zeroFills--) {
      ++currentSeqLength;
    }
    longestSeqLength = Math.max(longestSeqLength, currentSeqLength);
  });

  fs.writeFile(outputFileName, longestSeqLength, (err, data) => {
    if (err) throw err;
    // console.log(`Longest: ${longestSeqLength}, Zeroes: ${zeroesCnt}`)
    // console.timeEnd('Took: ');
  });
});

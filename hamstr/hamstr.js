'use strict';
// console.time('Took: ');
const fs = require('fs');
const sorters = require('../sorters');

const taskName = 'hamstr';
const inputFileName = process.argv[2] || taskName + '.in',
  outputFileName = process.argv[3] || taskName + '.out';

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  let contents = data.split('\n'),
    foodTotal = parseInt(contents[0]),
    hamstrCount = parseInt(contents[1]);
  let hamsters = new Array(hamstrCount);
  while (hamstrCount) {
    let hamstr = contents[hamstrCount + 1].split(' ');
    hamsters[--hamstrCount] = {
      hunger: parseInt(hamstr[0]),
      greed: parseInt(hamstr[1])
    };
  }
  
  // use binary search to find out the max number of hamsters we can feed
  let left = 1,
    right = hamsters.length;
  while (right - left > 1) {
    let middle = left + Math.floor((right-left) / 2);
    if (canFeedXHamsters(middle, foodTotal, hamsters)) {
      left = middle;
    } else {
      right = middle;
    }
  }
  let total = 0;
  if (canFeedXHamsters(left, foodTotal, hamsters)) total = left;
  if (canFeedXHamsters(right, foodTotal, hamsters)) total = right;

  fs.writeFile(outputFileName, total, (err, data) => {
    if (err) throw err;
    // console.timeEnd('Took: ');
  });
});

function canFeedXHamsters(x, foodCnt, ary) {
  return sorters.merge(ary.map(d => d.hunger + d.greed * (x - 1)))
    .slice(0, x)
    .reduce((acc, curr) => acc + curr) <= foodCnt;
}

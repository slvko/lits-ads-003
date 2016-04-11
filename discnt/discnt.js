'use strict';

const sorters = require('./sorters');
const fs = require('fs');

const inputFileName = process.argv[2] || 'case1.in',
  outputFileName = process.argv[3] || 'case1.out';

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  let contents = data.split('\n'),
    input = contents[0].split(' ').map(x => parseInt(x)),
    discnt = parseInt(contents[1]) / 100;

  console.time('Running Time');
  
  let l = input.length,
    discntItemsCount = (l - l % 3) / 3,
    sorted = sorters.selection(input, discntItemsCount),
    discounted = sorted.splice(0, discntItemsCount),
    result = discounted.reduce((acc, sel) => {
      return acc + sel * (1 - discnt);
    }, 0);

  result += sorted.reduce((acc, sel) => acc + sel, 0);
  result = result.toFixed(2);
  
  console.timeEnd('Running Time');

  fs.writeFile(outputFileName, result, (err, data) => {
    if (err) throw err;
    console.log(`Wrote ${result} to ${outputFileName}`);
  })
});

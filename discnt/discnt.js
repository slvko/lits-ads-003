'use strict';

const sorters = require('./sorters');
const fs = require('fs');

const inputFileName = process.argv[2] || 'discnt.in',
  outputFileName = process.argv[3] || 'discnt.out';

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  let contents = data.split('\n'),
    input = contents[0].split(' ').map(x => parseInt(x)),
    discnt = parseInt(contents[1]) / 100;
  
  let l = input.length,
    discntItemsCount = (l - l % 3) / 3,
    sorted = sorters.merge(input),
    discounted = sorted.splice(0, discntItemsCount),
    result = discounted.reduce((acc, sel) => {
      return acc + sel * (1 - discnt);
    }, 0);

  result += sorted.reduce((acc, sel) => acc + sel, 0);
  result = result.toFixed(2);

  fs.writeFile(outputFileName, result, (err, data) => {
    if (err) throw err;
  })
});

'use strict';
// console.time('Took: ');
const fs = require('fs'),
  BN = require('bn.js');

const taskName = 'ijones';
const inputFileName = process.argv[2] || taskName + '.in',
  outputFileName = process.argv[3] || taskName + '.out';

const alphabet = ['q','w','e','r','t','y','u','i','o','p','l','k','j','h','g','f','d','s','a','z','x','c','v','b','n','m'];

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  let contents = data.split('\n'),
    [w, h] = contents[0].split(' ').map(x => parseInt(x)),
    matrix = contents.slice(1, h+1),
    solutions = new Array(h).fill(new BN(0)),
    jumps = alphabet.reduce((map, char) => {
      map[char] = new BN(0);
      return map;
    }, {});
  for (let i = 0; i < h; i++) {
    solutions[i] = new BN((w > 1) ? 1 : 0);
    jumps[matrix[i][0]] = jumps[matrix[i][0]].add(new BN(1));
  }

  /* filling the table */
  for (let i = 1; i < w - 1; i++) {
    for (let j = 0; j < h; j++) {
      solutions[j] = getSolutionForElement(j, i);
    }
    for (let j = 0; j < h; j++) {
      let char = matrix[j][i];
      jumps[char] = jumps[char].add(solutions[j]);
    }
  }
  let topRSolution = getSolutionForElement(h-1, w-1),
    bottomRSolution = getSolutionForElement(0, w-1);
  fs.writeFile(outputFileName, topRSolution.add(h > 1 ? bottomRSolution : new BN(0)), err => {
    if (err) throw err;
    // console.log(topRSolution.add(h > 1 ? bottomRSolution : new BN(0)).toString());
    // console.timeEnd('Took: ');
  });

  function getSolutionForElement(hIndex, wIndex) {
    let char = matrix[hIndex][wIndex],
      leftChar = matrix[hIndex][wIndex-1];
    if (!leftChar) {
      return new BN(1);
    }
    if (char === leftChar) {
      return jumps[char];
    }
    return solutions[hIndex].add(jumps[char]);
  }

});
'use strict';
console.time('Took: ');
const fs = require('fs'),
  bigInt = require('big-integer');

const taskName = 'ijones';
const inputFileName = process.argv[2] || taskName + '.in',
  outputFileName = process.argv[3] || taskName + '.out';

const alphabet = ['q','w','e','r','t','y','u','i','o','p','l','k','j','h','g','f','d','s','a','z','x','c','v','b','n','m'];

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  let contents = data.split('\n'),
    [w, h] = contents[0].split(' ').map(x => parseInt(x)),
    matrix = contents.slice(1, h+1),
    solutions = new Array(h).fill(new Array(w - 1).fill(bigInt(0))),
    jumps = new Map();

  /* base cases */
  for (let i = 0; i < h; i++) {
    solutions[i][0] = bigInt(1);
  }
  alphabet.map((char) => {
    jumps.set(char, bigInt(0))
  });
  for (let i = 0; i < h; i++) {
    jumps.set(matrix[i][0], jumps.get(matrix[i][0]).plus(1));
  }

  /* filling the table */
  for (let i = 1; i < w - 1; i++) {
    for (let j = 0; j < h; j++) {
      let char = matrix[j][i],
        leftChar = matrix[j][i-1];
// console.log('before: ', j, i, solutions[1][1].toString())
      solutions[j][i] = bigInt(jumps.get(char));
// console.log('after: ', j, i, solutions[1][1].toString())
      if (char !== leftChar) {
        solutions[j][i] = solutions[j][i].plus(1);
      }
    }
    for (let j = 0; j < h; j++) {
      let char = matrix[j][i];
      if (jumps.has(char)) {
        jumps.set(char, jumps.get(char).plus(solutions[j][i]));
        
      }
    }
  }

  let topRChar = matrix[h-1][w-1],
    topRLChar = matrix[h-1][w-2],
    topRSolution = jumps.get(topRChar)
      .plus(topRChar !== topRLChar ? 1 : 0),
    bottomRChar = matrix[0][w-1],
    bottomRLChar = matrix[0][w-2],
    bottomRSolution = jumps.get(bottomRChar)
      .plus(bottomRChar !== bottomRLChar ? 1 : 0);

  // for(let i = 0; i < h; i++) {
  //   console.log(solutions[i].join(' '));
  // }
  // console.log(jumps);
  fs.writeFile(outputFileName, topRSolution.plus(bottomRSolution), err => {
    if (err) throw err;
    // console.log(topRSolution.plus(bottomRSolution).toString());
    console.timeEnd('Took: ');
  });
});
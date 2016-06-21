'use strict';
console.time('Took: ');
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
    solutions = Array.apply(null, Array(h)).map(() => {
      return Array.apply(null, Array(w-1)).map(() => {
        return new BN(0)
      })
    }),
    jumps = new Map();

  /* base cases */
  for (let i = 0; i < h; i++) {
    solutions[i][0] = new BN(1);
  }
  alphabet.map((char) => {
    jumps.set(char, new BN(0))
  });
  for (let i = 0; i < h; i++) {
    jumps.set(matrix[i][0], jumps.get(matrix[i][0]).add(new BN(1)));
  }

  /* filling the table */
  for (let i = 1; i < w - 1; i++) {
    for (let j = 0; j < h; j++) {
      let char = matrix[j][i],
        leftChar = matrix[j][i-1];
      solutions[j][i] = jumps.get(char);
      if (char !== leftChar) {
        solutions[j][i] = solutions[j][i].add(new BN(1));
      }
    }
    for (let j = 0; j < h; j++) {
      let char = matrix[j][i];
      if (jumps.has(char)) {
        jumps.set(char, jumps.get(char).add(solutions[j][i]));
      }
    }
  }

  let topRChar = matrix[h-1][w-1],
    topRLChar = matrix[h-1][w-2],
    topRSolution = jumps.get(topRChar)
      .add(new BN(topRChar !== topRLChar ? 1 : 0)) ,
    bottomRChar = matrix[0][w-1],
    bottomRLChar = matrix[0][w-2],
    bottomRSolution = jumps.get(bottomRChar)
      .add(new BN(bottomRChar !== bottomRLChar ? 1 : 0)) ;

  fs.writeFile(outputFileName, topRSolution.add(bottomRSolution), err => {
    if (err) throw err;
    console.log(topRSolution.add(bottomRSolution).toString());
    console.timeEnd('Took: ');
  });
});
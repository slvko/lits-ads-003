'use strict';
console.time('Took: ');
const fs = require('fs');

const taskName = 'wchain';
const inputFileName = process.argv[2] || taskName + '.in',
  outputFileName = process.argv[3] || taskName + '.out';

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  let contents = data.split('\n'),
    N = parseInt(contents[0]),
    lengthMap = new Map(),
    lengths = [];

  for (let i = 0; i < N; i++) {
    let word = contents[i + 1],
      l = word.length;
    if (lengthMap.has(l)) {
      lengthMap.get(l).push(word);
    } else {
      lengths.push(l);
      lengthMap.set(l, [word]);
    }
  }
  lengths.sort(); 
  /* base cases */
  let solutions = new Array(lengths.length);
  solutions[0] = 1;
  /* filling the table */
  for (let i = 1; i < lengths.length; i++) {
    let l = lengths[i],
      currWords = lengthMap.get(l),
      prevWords = lengthMap.get(lengths[i-1]);
    for (let k = 0; k < currWords.length; k++) {
      let word = currWords[k],
        minLev = Math.min(...prevWords.map(w => word.levenstein(w)));
        // console.log(l, minLev)
      if (1 === minLev) {
        solutions[i] = solutions[i-1] + 1;
        break;
      }
      solutions[i] = 1;
    }
  }

  fs.writeFile(outputFileName, Math.max(...solutions), err => {
    if (err) throw err;
    console.log(Math.max(...solutions));
    console.timeEnd('Took: ');
  });
});


String.prototype.levenstein = function(string) {
  var a = this, b = string + "", m = [], i, j, min = Math.min;

  if (!(a && b)) return (b || a).length;

  for (i = 0; i <= b.length; m[i] = [i++]);
  for (j = 0; j <= a.length; m[0][j] = j++);

  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      m[i][j] = b.charAt(i - 1) == a.charAt(j - 1)
        ? m[i - 1][j - 1]
        : m[i][j] = min(
          m[i - 1][j - 1] + 1, 
          min(m[i][j - 1] + 1, m[i - 1 ][j] + 1))
    }
  }

  return m[b.length][a.length];
}
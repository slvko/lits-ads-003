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
    dictionary = new Array(N),
    lengthMap = new Map(),
    lengthDiff = 0;

  for (let i = 0; i < N; i++) {
    let word = contents[i + 1],
      l = word.length;
    dictionary[i] = word;
    if (lengthMap.has(l)) {
      lengthMap.get(l).push(word);
    } else {
      ++lengthDiff;
      lengthMap.set(l, [word]);
    }
  }

  dictionary.sort(function(a, b) {
    return a.length - b.length;
  });

  /* base cases */
  let solutions = new Array(lengthDiff);
  solutions[0] = 1;
  /* filling the table */
  for (let l = 2; l <= lengthDiff; l++) {
    let currWords = lengthMap.get(l),
      prevWords = lengthMap.get(l - 1);
    for (let k = 0; k < currWords.length; k++) {
      let word = currWords[k],
        minLev = Math.min(...prevWords.map(w => word.levenstein(w)));
        // console.log(l, minLev)
      if (1 === minLev) {
        solutions[l-1] = solutions[l-2] + 1;
        break;
      }
      solutions[l-1] = 1;
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
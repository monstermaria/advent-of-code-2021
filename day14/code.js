const fs = require('fs/promises');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
const inputPromise = fs.readFile('./input.txt', 'utf-8');

const parseInput = (input) => {

  const rawLines = input.split('\n');

  if (rawLines.length === 0) {

    console.log('Not enough lines in input data');
    return;
  }

  const polymerInfo = {
    start: rawLines[0],
    expanders: {}
  };

  for (let i = 1; i < rawLines.length; i++) {

    if (rawLines[i] === '') {

      // skip empty lines
      continue;
    }

    const [combination, letterToInsert] = rawLines[i].split(' -> ');

    if (combination && letterToInsert) {

      polymerInfo.expanders[combination] = letterToInsert;

    } else {

      console.log('Incorrect input line:', rawLines[i]);
    }
  }

  return polymerInfo;
};

const expandPolymer = (polymer, expanders) => {

  let newPolymer = '';

  for(let i = 0; i < polymer.length - 1; i++) {

    let template = polymer.slice(i, i + 2);
    let newLetter = expanders[template];

    newPolymer += polymer.charAt(i) + newLetter;
  }

  newPolymer += polymer.charAt(polymer.length - 1);

  return newPolymer;
};

const handleStringResult = (result) => {

  const polymerInfo = parseInput(result);
  let polymer = polymerInfo.start;

  for (let i = 0; i < 10; i++) {

    polymer = expandPolymer(polymer, polymerInfo.expanders);
  }

  const letterCount = {};

  for (let i = 0; i < polymer.length; i++) {

    const letter = polymer.charAt(i);

    if (!letterCount[letter]) {

      letterCount[letter] = 0;
    }

    letterCount[letter]++;
  }

  let maxCount = Number.MIN_SAFE_INTEGER;
  let minCount = Number.MAX_SAFE_INTEGER;

  for (const count of Object.values(letterCount)) {

    maxCount = count > maxCount ? count : maxCount;
    minCount = count < minCount ? count : minCount;
  }

  console.log(polymer.length);
  console.log(letterCount);
  console.log('The answer is', maxCount - minCount);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });

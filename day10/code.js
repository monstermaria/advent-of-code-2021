const exp = require('constants');
const fs = require('fs/promises');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
const inputPromise = fs.readFile('./input.txt', 'utf-8');

const getLineScore = (line) => {

  let startingCharacters = '';
  let currentCharacter = '';
  let incorrectClosingCharacter = '';

  // parse the line
  for (let i = 0; i < line.length; i++) {

    currentCharacter = line[i];

    let expectedStartingCharacter = '';

    switch (currentCharacter) {
      case '(':
      case '[':
      case '{':
      case '<':
        startingCharacters += currentCharacter;
        break;
      case ')':
        expectedStartingCharacter = '(';
        break;
      case ']':
        expectedStartingCharacter = '[';
        break;
      case '}':
        expectedStartingCharacter = '{';
        break;
      case '>':
        expectedStartingCharacter = '<';
        break;
      default:
        console.log('not a valid character:', currentCharacter);
    }

    if (expectedStartingCharacter !== '') {

      const startingCharacter = startingCharacters.charAt(startingCharacters.length - 1);

      if (startingCharacter === expectedStartingCharacter) {
  
        // remove the last character by using a negative index
        startingCharacters = startingCharacters.slice(0, -1);

      } else {

        incorrectClosingCharacter = currentCharacter;
        break;
      }
    }
  }

  // determine score
  switch (incorrectClosingCharacter) {
    case '':
      return 0;
    case ')':
      return 3;
    case ']':
      return 57;
    case '}':
      return 1197;
    case '>':
      return 25137;
    default:
      console.log('not a valid character:', incorrectClosingCharacter);
      return 0;
  }
};

const handleStringResult = (result) => {

  const lines = result.split('\n');

  let totalScore = 0;

  for (let i = 0; i < lines.length; i++) {

    totalScore += getLineScore(lines[i]);
  }

  console.log('Total score is', totalScore);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });

const exp = require('constants');
const fs = require('fs/promises');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
const inputPromise = fs.readFile('./input.txt', 'utf-8');

const scoreForCompletingTheLine = (startingCharacters) => {

  if (startingCharacters.length === 0) {
    return -1;
  }

  let score = 0;

  for (let i = startingCharacters.length - 1; i >= 0; i--) {

    const currentCharacter = startingCharacters.charAt(i);

    score *= 5;

    switch (currentCharacter) {
      case '(':
        score += 1;
        break;
      case '[':
        score += 2;
        break;
      case '{':
        score += 3;
        break;
      case '<':
        score += 4;
        break;
      default:
        console.log('This should never happen!', currentCharacter);
    }
  }

  return score;
};

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
      return scoreForCompletingTheLine(startingCharacters);
    case ')':
    case ']':
    case '}':
    case '>':
      return -1;
    default:
      console.log('not a valid character:', incorrectClosingCharacter);
      return -1;
  }
};

const handleStringResult = (result) => {

  const lines = result.split('\n');
  const lineScores = [];

  for (let i = 0; i < lines.length; i++) {

    const scoreForThisLine = getLineScore(lines[i]);

    if (scoreForThisLine !== -1) {
      lineScores.push(scoreForThisLine);
    }
  }

  lineScores.sort((first, second) => {
    return first === second ? 0 : first < second ? -1 : 1;
  });

  console.log(lineScores);

  let middleIndex = (lineScores.length - 1) / 2;

  console.log(lineScores.length, middleIndex);
  console.log('Middle score is', lineScores[middleIndex]);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });

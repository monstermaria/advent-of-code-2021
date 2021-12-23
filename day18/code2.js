const fs = require('fs/promises');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
const inputPromise = fs.readFile('./input.txt', 'utf-8');


const handleExplosion = (number, startPosition) => {

  let newNumber = '';

  // find the stop position of the exploding pair
  let stopPosition = startPosition + 1;

  while (number[stopPosition] !== ']') {

    stopPosition++;
  }

  // increment stop position by 1, to make it point to the index after the closing bracket
  // this make it more suitable for use with string operations
  stopPosition++;

  // find the numbers in the exploding pair
  const numbersInPair = number.slice(startPosition, stopPosition).match(/[0-9]+/g)

  // find number before exploding pair
  let startPositionNumberBefore;
  let stopPositionNumberBefore;
  let numberBefore;

  const numbersBefore = [...number.slice(0, startPosition).matchAll(/[0-9]+/g)];

  if (numbersBefore.length > 0) {

    const numberBeforeInfo = numbersBefore[numbersBefore.length - 1];
    numberBefore = numberBeforeInfo[0];
    startPositionNumberBefore = numberBeforeInfo.index;
    stopPositionNumberBefore = startPositionNumberBefore + numberBefore.length;
  }

  // find number after exploding pair
  let startPositionNumberAfter;
  let stopPositionNumberAfter;
  let numberAfter;

  const numbersAfter = [...number.slice(stopPosition).matchAll(/[0-9]+/g)];

  if (numbersAfter.length > 0) {

    const numberAfterInfo = numbersAfter[0];
    numberAfter = numberAfterInfo[0];
    startPositionNumberAfter = numberAfterInfo.index + stopPosition;
    stopPositionNumberAfter = startPositionNumberAfter + numberAfter.length;
  }

  // build the new number string
  if (numberBefore) {

    const newNumberBefore = Number.parseInt(numberBefore) + Number.parseInt(numbersInPair[0]);
    newNumber = number.slice(0, startPositionNumberBefore) + newNumberBefore.toString();
    newNumber += number.slice(stopPositionNumberBefore, startPosition) + '0';

  } else {

    newNumber = number.slice(0, startPosition) + '0';
  }

  if (numberAfter) {

    const newNumberAfter = Number.parseInt(numberAfter) + Number.parseInt(numbersInPair[1]);
    newNumber += number.slice(stopPosition, startPositionNumberAfter) + newNumberAfter.toString();
    newNumber += number.slice(stopPositionNumberAfter);

  } else {

    newNumber += number.slice(stopPosition);
  }

  return newNumber;
};

const detectExplosion = (number) => {

  let nestingLevel = 0;

  for (let i = 0; i < number.length; i++) {

    const char = number.charAt(i);

    switch (char) {
      case '[':
        nestingLevel++;
        break;
      case ']':
        nestingLevel--;
        break;
      default:
      // do nothing
    }

    if (nestingLevel === 5) {

      // explosion detected
      number = handleExplosion(number, i);

      // only handle the first exploding pair
      break;
    }
  }

  return number;
};

const detectSplit = (number) => {

  const numbers = [...number.matchAll(/[0-9]+/g)];

  for (let i = 0; i < numbers.length; i++) {

    const numberInfo = numbers[i];

    // found a number that needs to be split
    if (numberInfo[0].length > 1) {

      let newNumber = '';

      // split the number
      const numberToSplit = Number.parseInt(numberInfo[0]);

      const firstNumber = Math.floor(numberToSplit / 2);
      const secondNumber = Math.ceil(numberToSplit / 2);

      // build the new number string
      newNumber = number.slice(0, numberInfo.index);
      newNumber += '[' + firstNumber.toString() + ',' + secondNumber.toString() + ']';
      newNumber += number.slice(numberInfo.index + numberInfo[0].length);

      // only handle the first split
      return newNumber;
    }
  }

  return number;
};

const addNumbers = (numberOne, numberTwo) => {

  // combine the numbers
  let sum = '[' + numberOne + ',' + numberTwo + ']';

  // reduce until no more changes
  let changesOccured = true;

  while (changesOccured) {

    const unalteredSum = sum;

    // check for explosions
    sum = detectExplosion(sum);

    changesOccured = sum !== unalteredSum;

    // check for splits
    if (!changesOccured) {

      sum = detectSplit(sum);
    }

    changesOccured = sum !== unalteredSum;
  }

  return sum;
};

const calculateMagnitude = (numberAndPosition) => {

  const { number, position } = numberAndPosition;
  let char = number.charAt(position);
  let value = Number.parseInt(char);

  if (Number.isInteger(value)) {

    return { value, position: position + 1 };
  }

  let leftMagnitude;
  let rightMagnitude;

  if (char = '[') {

    leftMagnitude = calculateMagnitude({ number, position: position + 1 });

    // sanity check
    if (number.charAt(leftMagnitude.position) !== ',') {

      console.log('Something is not quite right', leftMagnitude);
    }

    rightMagnitude = calculateMagnitude({ number, position: leftMagnitude.position + 1 });

    // sanity check
    if (number.charAt(rightMagnitude.position) !== ']') {

      console.log('Something is not quite right', rightMagnitude);
    }

  }

  return { value: 3 * leftMagnitude.value + 2 * rightMagnitude.value, position: rightMagnitude.position + 1 };
};

const handleStringResult = (result) => {

  const numbers = result.split('\n');

  let largestMagnitude = 0;

  // try all sums of two numbers in the list
  for (let i = 1; i < numbers.length; i++) {

    const firstNumber = numbers[i];

    if (firstNumber === '') {

      continue;
    }

    for (let j = 0; j < numbers.length; j++) {

      if (i === j) {

        continue;
      }

      const secondNumber = numbers[j];

      if (secondNumber === '') {

        continue;
      }

      const sum = addNumbers(firstNumber, secondNumber);
      const magnitude = calculateMagnitude({ number: sum, position: 0 });

      largestMagnitude = largestMagnitude < magnitude.value ? magnitude.value : largestMagnitude;
    }
  }

  console.log('Largest magnitude:', largestMagnitude);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });

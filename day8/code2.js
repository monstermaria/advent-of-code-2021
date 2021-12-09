const fs = require('fs/promises');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
const inputPromise = fs.readFile('./input.txt', 'utf-8');

const compareCodes = (code1, code2) => {

  const info = {
    code1,
    code2,
    equal: code1 === code2 ? true : false,
    commonLetters: '',
    lettersOnlyInCode1: '',
    lettersOnlyInCode2: '',
  };

  for (let i = 0; i < code1.length; i++) {

    const letter = code1[i];

    if (code2.indexOf(letter) === -1) {
      info.lettersOnlyInCode1 += letter;
    } else {
      info.commonLetters += letter;
    }
  }

  for (let i = 0; i < code2.length; i++) {

    const letter = code2[i];

    if (code1.indexOf(letter) === -1) {
      info.lettersOnlyInCode2 += letter;
    }
  }

  return info;
};

const interpretLine = (line) => {

  // skip lines that does not have the correct data
  if (line.digitCodes.length !== 10) {
    console.log('Not the right number of codes', line);
    line.number = 0;
    return;
  }

  const sortCodeString = (code) => {
    return code.split('').sort().join('');
  };

  const sortByLength = (first, second) => {
    return first.length === second.length ? 0 : first.length < second.length ? -1 : 1;
  };

  const digitCodes = line.digitCodes.map(sortCodeString).sort(sortByLength);
  const digitCodesInOrder = [];

  let comparison;

  // one, four, seven and eight all have a unique code length
  // that makes them easily identifiable in an array sorted by the length of the elements
  // the first three codes in digitCodes represent 1, 7 and 4 and the last one (index 9) is 8
  digitCodesInOrder[1] = digitCodes[0];
  digitCodesInOrder[7] = digitCodes[1];
  digitCodesInOrder[4] = digitCodes[2];
  digitCodesInOrder[8] = digitCodes[9];

  // the remaining numbers can be grouped by length

  // two, three and five all have the length 5 and are located in positions 3-5
  const digitCodesLength5 = digitCodes.slice(3, 6);

  // zero, six and nine all have the length 6 and are located in positions 6-8
  const digitCodesLength6 = digitCodes.slice(6, 9);

  // six can be identified by comparing one to the codes with length 6
  // six is the one where not all segments in one is included
  for (let i = 0; i < digitCodesLength6.length; i++) {

    comparison = compareCodes(digitCodesInOrder[1], digitCodesLength6[i]);

    if (comparison.lettersOnlyInCode1.length > 0) {
      digitCodesInOrder[6] = digitCodesLength6[i];
      digitCodesLength6.splice(i, 1);
      break;
    }
  }

  // nine can be identified by comparing four to the codes with length 6
  // nine is the one where all segments in four are included
  for (let i = 0; i < digitCodesLength6.length; i++) {

    comparison = compareCodes(digitCodesInOrder[4], digitCodesLength6[i]);

    if (comparison.lettersOnlyInCode1.length === 0) {
      digitCodesInOrder[9] = digitCodesLength6[i];
      digitCodesLength6.splice(i, 1);
      break;
    }
  }

  // zero is the only one left in the group with length 6
  digitCodesInOrder[0] = digitCodesLength6[0];

  // now we can solve the group with length 5

  // three can be identified by comparing one to the codes with length 5
  // three is the one where both segments in one is included
  for (let i = 0; i < digitCodesLength5.length; i++) {

    comparison = compareCodes(digitCodesInOrder[1], digitCodesLength5[i]);

    if (comparison.lettersOnlyInCode1.length === 0) {
      digitCodesInOrder[3] = digitCodesLength5[i];
      digitCodesLength5.splice(i, 1);
      break;
    }
  }

  // five can be identified by comparing nine to the codes with length 5
  // five is the one where nine completely overlaps the segments
  for (let i = 0; i < digitCodesLength5.length; i++) {

    comparison = compareCodes(digitCodesInOrder[9], digitCodesLength5[i]);

    if (comparison.lettersOnlyInCode2.length === 0) {
      digitCodesInOrder[5] = digitCodesLength5[i];
      digitCodesLength5.splice(i, 1);
      break;
    }
  }

  // two is the only one left in the group with length 5
  digitCodesInOrder[2] = digitCodesLength5[0];

  // time to interpret the number codes!
  const numberCodes = line.numberCodes.map(sortCodeString);
  // let number = 0;
  line.number = 0;

  for (let i = 0; i < numberCodes.length; i++) {

    for(let j = 0; j < 10; j++) {

      if (numberCodes[i] === digitCodesInOrder[j]) {

        line.number *= 10;
        line.number += j;
      }
    }
  }
};

const handleStringResult = (result) => {

  const lines = result.split('\n').map(line => {

    const lineArray = line.split(' | ');

    if (lineArray.length < 2) {
      return {digitCodes: [], numberCodes: []};
    }

    const digitCodes = lineArray[0].split(' ');
    const numberCodes = lineArray[1].split(' ');

    return {digitCodes, numberCodes};
  });

  let sumOfNumbers = 0;

  for (let i = 0; i < lines.length; i++) {

    const line = lines[i];

    interpretLine(line);

    sumOfNumbers += line.number;
  }

  console.log(sumOfNumbers);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });

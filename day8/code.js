const fs = require('fs/promises');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
const inputPromise = fs.readFile('./input.txt', 'utf-8');

const countUniqueNumberOfSegments = (lines) => {

  let totalNumber = 0;

  for (let i = 0; i < lines.length; i++) {

    const number = lines[i].number;

    for (let j = 0; j < number.length; j++) {

      const numberOfSegments = number[j].length;

      switch (numberOfSegments) {
        case 2:
        case 3:
        case 4:
        case 7:
          totalNumber++;
          break;
        default:
          break;
      }
    }
  }

  return totalNumber;
};

const handleStringResult = (result) => {

  const lines = result.split('\n').map(line => {

    const lineArray = line.split(' | ');

    if (lineArray.length < 2) {
      return {digits: [], number: []};
    }

    const digits = lineArray[0].split(' ');
    const number = lineArray[1].split(' ');

    return {digits, number};
  });

  console.log(countUniqueNumberOfSegments(lines));

};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });

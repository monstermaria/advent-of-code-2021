const fs = require('fs/promises');

const inputPromise = fs.readFile('./input.txt', 'utf-8');

const parseInt = (nbrString, radix) => {
  let nbr;

  try {
    nbr = Number.parseInt(nbrString, radix);
  } catch (error) {
    console.error(error);
  }

  return nbr;
};

const handleStringResult = (result) => {

  const bitInfoArray = [];

  const readingStrings = result.split('\n');

  const numberOfBits = readingStrings[0].length;

  for (let i = 0; i < numberOfBits; i++) {
    bitInfoArray[i] = {
      ones: 0,
      zeroes: 0
    };
  }


  for (let i = 0; i < readingStrings.length; i++) {
    const bits = readingStrings[i].split('');

    for (let j = 0; j < bits.length; j++) {
      if (bits[j] === '1') {
        bitInfoArray[j].ones++;
      } else if (bits[j] === '0') {
        bitInfoArray[j].zeroes++;
      } else {
        console.error('Non-binary input detected:', bits[j]);
      }
    }
  }

  console.log(bitInfoArray);

  let gamma = '';
  let epsilon = '';

  for (let i = 0; i < bitInfoArray.length; i ++) {
    const moreOnes = bitInfoArray[i].ones > bitInfoArray[i].zeroes;
    if (moreOnes) {
      gamma += '1';
      epsilon += '0';
    } else {
      gamma += '0';
      epsilon += '1';
    }
  }

  console.log('Gamma:', gamma, parseInt(gamma, 2));
  console.log('Epsilon:', epsilon, parseInt(epsilon, 2));

  gamma = parseInt(gamma, 2);
  epsilon = parseInt(epsilon, 2);

  console.log('Result:', gamma * epsilon);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });

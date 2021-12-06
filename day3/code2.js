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

const bitCount = (readingStrings, position) => {
  let ones = 0;
  let zeroes = 0;

  for (let i = 0; i < readingStrings.length; i++) {
    const bit = readingStrings[i].charAt(position);

    if (bit === '1') {
      ones++;
    } else if (bit === '0') {
      zeroes++;
    } else {
      console.error('Non-binary input detected', bit);
    }
  }

  return {ones, zeroes};
};

const findValueToFilterOn = (readingStrings, position, preferredValue, choseDominant) => {

  const {ones, zeroes} = bitCount(readingStrings, position);

  if (ones === zeroes) {
    return preferredValue;
  }

  if (ones > zeroes && choseDominant || ones < zeroes && !choseDominant) {
    return '1';
  } else {
    return '0';
  }
};

const findReadingString = (readingStrings, position, preferredValue, choseDominant) => {

  if (readingStrings.length === 1) {
    return readingStrings[0];
  }

  const valueToFilterOn = findValueToFilterOn(readingStrings, position, preferredValue, choseDominant);

  const filteredReadingStrings = readingStrings.filter(str => {
    return str[position] === valueToFilterOn;
  })

  return findReadingString(filteredReadingStrings, position + 1, preferredValue, choseDominant);
};

const handleStringResult = (result) => {

  const readingStrings = result.split('\n');
  const oxygenGeneratorRating = findReadingString(readingStrings, 0, '1', true);
  const co2ScrubberRating = findReadingString(readingStrings, 0, '0', false);

  console.log(oxygenGeneratorRating, parseInt(oxygenGeneratorRating, 2));
  console.log(co2ScrubberRating, parseInt(co2ScrubberRating, 2));
  console.log(parseInt(oxygenGeneratorRating, 2) * parseInt(co2ScrubberRating, 2));
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });

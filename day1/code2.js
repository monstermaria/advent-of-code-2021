const fs = require('fs/promises');

const inputPromise = fs.readFile('./input.txt', 'utf-8');

const handleStringResult = (result) => {

  const numberStrings = result.split('\r\n');

  const numbers = numberStrings.map(nbrString => {
    let nbr;

    try {
      nbr = Number.parseInt(nbrString);
    } catch (error) {
      console.error(error);
    }

    return nbr;
  });

  let numberOfTimesDepthIncreased = 0;

  for (let i = 0; i < numbers.length - 3; i++) {
    const number1 = numbers[i] + numbers[i + 1] + numbers[i + 2];
    const number2 = numbers[i + 1] + numbers[i + 2] + numbers[i + 3];

    if (number1 < number2) {
      numberOfTimesDepthIncreased++;
    }
  }

  console.log(numberOfTimesDepthIncreased);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });

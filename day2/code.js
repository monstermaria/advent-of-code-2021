const fs = require('fs/promises');

const inputPromise = fs.readFile('./input.txt', 'utf-8');

const parseInt = (nbrString) => {
  let nbr;

  try {
    nbr = Number.parseInt(nbrString);
  } catch (error) {
    console.error(error);
  }

  return nbr;
};

const handleStringResult = (result) => {

  const commandStrings = result.split('\n');

  console.log(commandStrings);

  let forwardPosition = 0;
  let depthPosition = 0;

  for (const command of commandStrings) {
    const [type, amountString] = command.split(' ');
    const amount = parseInt(amountString);

    switch (type) {
      case 'forward':
        forwardPosition += amount;
        break;
      case 'down':
        depthPosition += amount;
        break;
      case 'up':
        depthPosition -= amount;
        break;
      default:
        console.log('Unknown command:', type);
    }
  }

  console.log('Forward position:', forwardPosition);
  console.log('Depth position:', depthPosition);
  console.log('Answer:', forwardPosition * depthPosition);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });

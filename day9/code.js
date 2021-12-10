const fs = require('fs/promises');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
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

  const mapLines = result.split('\n');

  let sumOfRiskLevels = 0;

  for (let row = 0; row < mapLines.length; row++) {

    for (let column = 0; column < mapLines[row].length; column++) {

      const currentHeigth = parseInt(mapLines[row].charAt(column));

      if (row > 0) {
        const upHeigth = parseInt(mapLines[row - 1].charAt(column));

        if (currentHeigth >= upHeigth) {
          continue;
        }
      }

      if (row < mapLines.length - 1) {
        const downHeigth = parseInt(mapLines[row + 1].charAt(column));

        if (currentHeigth >= downHeigth) {
          continue;
        }
      }

      if (column > 0) {
        const leftHeigth = parseInt(mapLines[row].charAt(column - 1));

        if (currentHeigth >= leftHeigth) {
          continue;
        }
      }

      if (column < mapLines[row].length - 1) {
        const rightHeigth = parseInt(mapLines[row].charAt(column + 1));

        if (currentHeigth >= rightHeigth) {
          continue;
        }
      }

      console.log('Low point found, row:', row, 'column:', column);
      sumOfRiskLevels += currentHeigth + 1;
    }
  }

  console.log(sumOfRiskLevels);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
